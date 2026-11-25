import assert from 'node:assert/strict';
import { after, beforeEach, test } from 'node:test';
import { COOKIE, criarToken } from '../../../auth/sessao.js';
import { criarApp } from '../src/app.js';
import { criarRepositorioMemoria } from '../src/repositorios/memoria.js';
import { criarRepositorioMongo } from '../src/repositorios/mongo.js';

/* Cada teste começa com um banco novo, carregado de Codigo/db/db.json.
   Em memória por padrão; com TEST_MONGODB_URI, usa um banco novo no MongoDB a cada teste. */
process.env.AUTH_SECRET ||= 'segredo-de-teste-com-mais-de-32-caracteres';
const MONGO = process.env.TEST_MONGODB_URI;
let repo;
let servidor;
let base;
let n = 0;

async function fecharAtual() {
  servidor?.close();
  await repo?.fechar();
}

beforeEach(async () => {
  await fecharAtual();
  repo = MONGO ? criarRepositorioMongo(MONGO, `acessamob_teste_agenda_${Date.now()}_${n++}`) : criarRepositorioMemoria();
  await repo.conectar();
  servidor = criarApp(repo).listen(0);
  await new Promise((ok) => servidor.once('listening', ok));
  base = `http://localhost:${servidor.address().port}/api`;
});

after(fecharAtual);

/* usuario: id de quem está na sessão; null = sem sessão */
async function api(metodo, caminho, corpo, usuario = 'usr-4') {
  const headers = { 'Content-Type': 'application/json' };
  if (usuario) headers.Cookie = COOKIE + '=' + criarToken(usuario);
  const res = await fetch(base + caminho, {
    method: metodo,
    headers,
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  return { status: res.status, corpo: res.status === 204 ? null : await res.json() };
}

const NOVO = {
  tipo: 'consulta',
  data: '2026-11-12',
  horario: '14:00',
  titulo: 'Consulta: Oftalmologia',
  subtitulo: 'Dr. Paulo Mendes',
};

test('usuário logado, catálogos da agenda e idosos acompanhados', async () => {
  const eu = (await api('GET', '/usuarios/eu', undefined, 'usr-1')).corpo;
  assert.equal(eu.id, 'usr-1');
  assert.equal(eu.senhaHash, undefined);

  const cat = (await api('GET', '/catalogos')).corpo;
  assert.deepEqual(cat.tiposEvento.map((t) => t.id), ['consulta', 'exame', 'visita', 'medicamento', 'tarefa']);
  assert.equal(cat.meses[9], 'Outubro');

  const ids = async (u) => (await api('GET', '/idosos', undefined, u)).corpo.map((i) => i.id).sort();
  assert.deepEqual(await ids('usr-1'), ['ido-1', 'ido-2']);
  assert.deepEqual(await ids('usr-2'), ['ido-1']);
  assert.equal((await api('GET', '/idosos', undefined, 'usr-999')).status, 401);
});

test('agenda do mês expande os eventos recorrentes e resume por tipo', async () => {
  const { status, corpo } = await api('GET', '/idosos/ido-1/agenda/2026-10');
  assert.equal(status, 200);

  /* Losartana todo dia de 27 a 31 (5), exame, consulta e visita no dia 27, consulta no 28, exame no 30 */
  assert.equal(corpo.eventos.length, 10);
  assert.deepEqual(corpo.resumo, { consulta: 2, exame: 2, visita: 1, medicamento: 3 });

  const ordem = corpo.eventos.map((e) => e.data + e.horario);
  assert.deepEqual(ordem, [...ordem].sort());

  const dia27 = corpo.eventos.filter((e) => e.data === '2026-10-27').map((e) => e.horario);
  assert.deepEqual(dia27, ['08:00', '09:00', '10:30', '15:00']);

  const losartana = (data) => corpo.eventos.find((e) => e.chave === 'evt-1@' + data);
  assert.equal(losartana('2026-10-27').status, 'concluido', 'dia de início guarda o status do evento');
  assert.equal(losartana('2026-10-28').status, 'confirmado', 'repetições começam confirmadas');
  assert.equal(corpo.eventos.find((e) => e.data === '2026-10-26'), undefined, 'nada antes da data de início');

  /* visita semanal às terças: 4 em novembro de 2026 */
  const nov = (await api('GET', '/idosos/ido-1/agenda/2026-11')).corpo;
  assert.deepEqual(nov.eventos.filter((e) => e.tipo === 'visita').map((e) => e.data),
    ['2026-11-03', '2026-11-10', '2026-11-17', '2026-11-24']);
  assert.equal(nov.eventos.filter((e) => e.tipo === 'medicamento').length, 30);

  assert.equal((await api('GET', '/idosos/ido-1/agenda/2026-13')).status, 400);
  assert.equal((await api('GET', '/idosos/ido-1/agenda/outubro')).status, 400);
});

test('remédio registrado como feito na tela inicial aparece concluído na agenda', async () => {
  await repo.salvarRegistro(
    { idosoId: 'ido-1', data: '2026-10-28', tipo: 'medicamento', itemId: 'med-1', horarioPrevisto: '08:00' },
    { status: 'feito', horarioRegistro: '08:03', registradoPor: 'usr-1' },
  );
  const { eventos } = (await api('GET', '/idosos/ido-1/agenda/2026-10')).corpo;
  assert.equal(eventos.find((e) => e.chave === 'evt-1@2026-10-28').status, 'concluido');
  assert.equal(eventos.find((e) => e.chave === 'evt-1@2026-10-29').status, 'confirmado');
});

test('próximos compromissos ignoram rotina e cancelados', async () => {
  const lista = (await api('GET', '/idosos/ido-1/agenda/proximos?de=2026-10-27')).corpo;
  assert.deepEqual(lista.map((e) => e.chave), [
    'evt-5@2026-10-28', 'evt-6@2026-10-30', 'evt-4@2026-11-03', 'evt-4@2026-11-10',
  ]);

  await api('PATCH', '/idosos/ido-1/eventos/evt-5', { status: 'cancelado' });
  const dois = (await api('GET', '/idosos/ido-1/agenda/proximos?de=2026-10-27&limite=2')).corpo;
  assert.deepEqual(dois.map((e) => e.chave), ['evt-6@2026-10-30', 'evt-4@2026-11-03']);

  assert.equal((await api('GET', '/idosos/ido-1/agenda/proximos?limite=0')).status, 400);
  assert.equal((await api('GET', '/idosos/ido-1/agenda/proximos?de=2026-02-30')).status, 400);
});

test('cria, altera e exclui compromisso', async () => {
  const criado = await api('POST', '/idosos/ido-1/eventos', NOVO);
  assert.equal(criado.status, 201);
  assert.match(criado.corpo.id, /^evt-/);
  assert.equal(criado.corpo.status, 'confirmado');
  assert.equal(criado.corpo.recorrencia, null);
  assert.equal(criado.corpo.origem, null);
  assert.deepEqual(criado.corpo.lembrete, { ativo: false, minutosAntes: 0 });

  const id = criado.corpo.id;
  const mes = async () => (await api('GET', '/idosos/ido-1/agenda/2026-11')).corpo;
  assert.equal((await mes()).resumo.consulta, 1);

  const alterado = await api('PATCH', `/idosos/ido-1/eventos/${id}`, { horario: '15:30', status: 'pendente' });
  assert.equal(alterado.status, 200);
  assert.equal(alterado.corpo.horario, '15:30');
  assert.equal(alterado.corpo.titulo, NOVO.titulo);

  await api('PATCH', `/idosos/ido-1/eventos/${id}`, { status: 'cancelado' });
  assert.equal((await mes()).resumo.consulta, 0, 'cancelado não conta no resumo');

  assert.equal((await api('DELETE', `/idosos/ido-1/eventos/${id}`)).status, 204);
  assert.equal((await api('GET', `/idosos/ido-1/eventos/${id}`)).status, 404);
  assert.equal((await mes()).eventos.some((e) => e.eventoId === id), false);
});

test('compromisso semanal só aparece nos dias escolhidos', async () => {
  const corpo = {
    ...NOVO, tipo: 'visita', data: '2026-11-02', titulo: 'Visita da fisioterapeuta',
    recorrencia: { frequencia: 'semanal', diasSemana: ['qua', 'seg'] },
    lembrete: { ativo: true, minutosAntes: 30 },
  };
  const { status, corpo: evento } = await api('POST', '/idosos/ido-1/eventos', corpo);
  assert.equal(status, 201);
  assert.deepEqual(evento.recorrencia.diasSemana, ['seg', 'qua']);

  /* segundas e quartas de 2 a 30 de novembro de 2026 */
  const { eventos } = (await api('GET', '/idosos/ido-1/agenda/2026-11')).corpo;
  const datas = eventos.filter((e) => e.eventoId === evento.id).map((e) => e.data);
  assert.equal(datas.length, 9);
  assert.equal(datas[0], '2026-11-02');
  assert.equal(datas[1], '2026-11-04');

  const diaria = await api('POST', '/idosos/ido-1/eventos', { ...NOVO, recorrencia: { frequencia: 'diaria' } });
  assert.equal(diaria.corpo.recorrencia.diasSemana.length, 7);
});

test('validação dos compromissos', async () => {
  const erro = async (corpo) => {
    const r = await api('POST', '/idosos/ido-1/eventos', corpo);
    assert.equal(r.status, 400, JSON.stringify(corpo));
    return r.corpo.erro;
  };
  assert.match(await erro({ ...NOVO, tipo: 'festa' }), /Tipo/);
  assert.match(await erro({ ...NOVO, data: '2026-02-30' }), /Data/);
  assert.match(await erro({ ...NOVO, horario: '25:00' }), /Horário/);
  assert.match(await erro({ ...NOVO, titulo: '   ' }), /Título/);
  assert.match(await erro({ ...NOVO, status: 'talvez' }), /Status/);
  assert.match(await erro({ ...NOVO, recorrencia: { frequencia: 'semanal', diasSemana: [] } }), /Dias/);
  assert.match(await erro({ ...NOVO, recorrencia: { frequencia: 'mensal' } }), /Frequência/);
  assert.match(await erro({ ...NOVO, lembrete: { ativo: true, minutosAntes: -5 } }), /lembrete/);

  assert.equal((await api('PATCH', '/idosos/ido-1/eventos/evt-1', {})).status, 400);
  assert.equal((await api('PATCH', '/idosos/ido-1/eventos/evt-999', { status: 'pendente' })).status, 404);
});

test('cada usuário só mexe na agenda dos idosos que acompanha', async () => {
  assert.equal((await api('GET', '/idosos/ido-2/agenda/2026-10', undefined, 'usr-2')).status, 403);
  assert.equal((await api('POST', '/idosos/ido-2/eventos', NOVO, 'usr-4')).status, 403);
  assert.equal((await api('GET', '/idosos/ido-9/agenda/2026-10')).status, 404);

  /* evento de outro idoso não é encontrado pela rota deste */
  assert.equal((await api('DELETE', '/idosos/ido-2/eventos/evt-1', undefined, 'usr-5')).status, 404);
  assert.equal((await api('GET', '/idosos/ido-1/eventos/evt-1', undefined, 'usr-4')).status, 200);
  assert.equal((await api('GET', '/idosos', undefined, null)).status, 401);

  /* cuidador só muda a situação */
  assert.equal((await api('PATCH', '/idosos/ido-1/eventos/evt-1', { status: 'concluido' }, 'usr-1')).status, 200);
  assert.equal((await api('PATCH', '/idosos/ido-1/eventos/evt-1', { titulo: 'Outro' }, 'usr-1')).status, 403);
  assert.equal((await api('POST', '/idosos/ido-1/eventos', NOVO, 'usr-1')).status, 403);
});
