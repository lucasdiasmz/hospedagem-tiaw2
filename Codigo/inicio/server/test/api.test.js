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
  repo = MONGO ? criarRepositorioMongo(MONGO, `acessamob_teste_${Date.now()}_${n++}`) : criarRepositorioMemoria();
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

const DIA = '/idosos/ido-1/dias/2026-10-27';

test('usuário logado e catálogos', async () => {
  const eu = (await api('GET', '/usuarios/eu', undefined, 'usr-1')).corpo;
  assert.equal(eu.id, 'usr-1');
  assert.equal(eu.perfil.id, 'cui-1');
  assert.equal(eu.senhaHash, undefined);

  assert.equal((await api('GET', '/usuarios/eu', undefined, 'usr-4')).corpo.perfil.id, 'cli-1');
  assert.equal((await api('GET', '/usuarios/eu', undefined, 'usr-999')).status, 401);
  assert.deepEqual((await api('GET', '/catalogos')).corpo.statusRegistro, ['feito', 'recusou']);
});

test('cada usuário só vê os idosos que acompanha', async () => {
  const ids = async (u) => (await api('GET', '/idosos', undefined, u)).corpo.map((i) => i.id).sort();
  assert.deepEqual(await ids('usr-1'), ['ido-1', 'ido-2']);
  assert.deepEqual(await ids('usr-2'), ['ido-1']);
  assert.deepEqual(await ids('usr-4'), ['ido-1']);

  assert.equal((await api('GET', '/idosos/ido-2', undefined, 'usr-2')).status, 403);
  assert.equal((await api('GET', '/idosos/ido-2/dias/2026-10-27', undefined, 'usr-4')).status, 403);
  assert.equal((await api('GET', '/idosos/ido-9')).status, 404);
});

test('dia junta medicamentos, tarefas, consultas e visitas com os registros', async () => {
  const { status, corpo } = await api('GET', DIA);
  assert.equal(status, 200);

  /* terça: 3 remédios ativos, 3 tarefas de terça, 1 consulta, 1 visita */
  assert.equal(corpo.itens.length, 8);
  const horarios = corpo.itens.map((i) => i.horario);
  assert.deepEqual(horarios, [...horarios].sort());

  const losartana = corpo.itens.find((i) => i.itemId === 'med-1');
  assert.equal(losartana.status, 'feito');
  assert.equal(losartana.horarioRegistro, '08:10');

  assert.ok(!corpo.itens.some((i) => i.itemId === 'med-4'), 'remédio inativo não aparece');
  assert.ok(!corpo.itens.some((i) => i.itemId === 'tar-2'), 'tarefa de seg/qua/sex não aparece na terça');
  assert.equal(corpo.itens.find((i) => i.tipo === 'agendamento').titulo, 'Visita de Ana Souza');
  assert.equal(corpo.anotacoes.length, 1);
});

test('registrar, desfazer e adiar item', async () => {
  let r = await api('PATCH', DIA + '/itens/med-2', { status: 'feito', horarioRegistro: '12:05' });
  assert.equal(r.status, 200);
  assert.equal(r.corpo.status, 'feito');
  assert.equal(r.corpo.registradoPor, 'usr-4');

  r = await api('PATCH', DIA + '/itens/con-1', { horarioAdiado: '11:00' });
  assert.equal(r.corpo.horario, '11:00');
  assert.equal(r.corpo.horarioPrevisto, '10:30');

  r = await api('PATCH', DIA + '/itens/med-2', { status: null });
  assert.equal(r.corpo.status, null);
  assert.equal(r.corpo.horarioRegistro, null);

  /* no dia seguinte nada disso vale */
  const amanha = (await api('GET', '/idosos/ido-1/dias/2026-10-28')).corpo;
  assert.equal(amanha.itens.find((i) => i.itemId === 'med-1').status, null);
});

test('remédio com dois horários exige horarioPrevisto', async () => {
  await api('PATCH', '/idosos/ido-1/medicamentos/med-1', { horarios: ['08:00', '20:00'] });

  assert.equal((await api('PATCH', DIA + '/itens/med-1', { status: 'feito' })).status, 400);
  const r = await api('PATCH', DIA + '/itens/med-1', { horarioPrevisto: '20:00', status: 'recusou' });
  assert.equal(r.status, 200);
  assert.equal(r.corpo.horarioPrevisto, '20:00');
});

test('anotações: criar e só o autor apaga', async () => {
  const criada = await api('POST', DIA + '/anotacoes', { hora: '09:15', texto: '  Glicemia 110 ' });
  assert.equal(criada.status, 201);
  assert.equal(criada.corpo.texto, 'Glicemia 110');
  assert.equal(criada.corpo.autorId, 'usr-4');
  assert.match(criada.corpo.id, /^not-/);

  assert.equal((await api('DELETE', DIA + '/anotacoes/' + criada.corpo.id, undefined, 'usr-2')).status, 403);
  assert.equal((await api('DELETE', DIA + '/anotacoes/' + criada.corpo.id)).status, 204);
  assert.equal((await api('DELETE', DIA + '/anotacoes/' + criada.corpo.id)).status, 404);
});

test('cadastro de medicamento, tarefa e consulta aparece no dia', async () => {
  const med = await api('POST', '/idosos/ido-1/medicamentos', {
    nome: 'Omeprazol', dosagem: '20 mg', forma: 'Cápsula', via: 'Oral', horarios: ['07:00'],
  });
  assert.equal(med.status, 201);
  assert.equal(med.corpo.frequencia, 1);
  assert.equal(med.corpo.ativo, true);
  assert.equal(med.corpo.cadastradoPor, 'usr-4');

  const tar = await api('POST', '/idosos/ido-1/tarefas', { horario: '17:00', titulo: 'Leitura', diasSemana: ['ter'] });
  assert.equal(tar.status, 201);

  const con = await api('POST', '/idosos/ido-1/consultas', {
    data: '2026-10-27', horario: '16:00', especialidade: 'Geriatria',
  });
  assert.equal(con.corpo.status, 'agendada');

  const itens = (await api('GET', DIA)).corpo.itens.map((i) => i.itemId);
  assert.ok(itens.includes(med.corpo.id) && itens.includes(tar.corpo.id) && itens.includes(con.corpo.id));

  await api('PATCH', '/idosos/ido-1/medicamentos/' + med.corpo.id, { ativo: false });
  assert.equal((await api('DELETE', '/idosos/ido-1/tarefas/' + tar.corpo.id)).status, 204);
  const depois = (await api('GET', DIA)).corpo.itens.map((i) => i.itemId);
  assert.ok(!depois.includes(med.corpo.id) && !depois.includes(tar.corpo.id));

  /* remédio de outro idoso não é acessível por este caminho */
  assert.equal((await api('GET', '/idosos/ido-1/medicamentos/med-5')).status, 404);
});

test('chamado de ajuda avisa cliente e cuidadores, menos quem abriu', async () => {
  const r = await api('POST', '/idosos/ido-1/chamados', { mensagem: 'Caiu no banheiro' });
  assert.equal(r.status, 201);
  assert.equal(r.corpo.status, 'aberto');
  assert.deepEqual(r.corpo.notificados.sort(), ['usr-1', 'usr-2']);

  const atendido = await api('PATCH', '/idosos/ido-1/chamados/' + r.corpo.id, { status: 'atendido' });
  assert.equal(atendido.corpo.status, 'atendido');
  assert.equal((await api('GET', '/idosos/ido-1/chamados')).corpo.length, 1);
});

test('pedido de ajuda: aparece nos avisos da rede, alguém vai e depois resolve', async () => {
  const novo = (await api('POST', '/idosos/ido-1/chamados', { mensagem: 'Caiu' }, 'usr-4')).corpo;
  const doCuidador = (await api('GET', '/avisos', undefined, 'usr-1')).corpo.chamados.find((c) => c.id === novo.id);
  assert.equal(doCuidador.status, 'aberto');
  assert.equal(doCuidador.abertoPorNome, 'Carla Ribeiro');
  assert.equal(doCuidador.meu, false);

  await api('PATCH', '/idosos/ido-1/chamados/' + novo.id, { acao: 'indo' }, 'usr-1');
  const deQuemPediu = (await api('GET', '/avisos', undefined, 'usr-4')).corpo.chamados.find((c) => c.id === novo.id);
  assert.equal(deQuemPediu.status, 'a-caminho');
  assert.equal(deQuemPediu.indoPorNome, 'Maria Silva');
  assert.equal(deQuemPediu.meu, true);

  await api('PATCH', '/idosos/ido-1/chamados/' + novo.id, { acao: 'resolvido' }, 'usr-1');
  const resolvido = (await api('GET', '/avisos', undefined, 'usr-4')).corpo.chamados.find((c) => c.id === novo.id);
  assert.equal(resolvido.status, 'atendido');
  assert.equal((await api('PATCH', '/idosos/ido-1/chamados/' + novo.id, { acao: 'sumir' })).status, 400);
  /* quem não está na rede não vê */
  assert.equal((await api('GET', '/avisos', undefined, 'usr-5')).corpo.chamados.some((c) => c.id === novo.id), false);
});

test('solicitação de atendimento: o cuidador aceita e entra na rede', async () => {
  const recebidas = (await api('GET', '/avisos', undefined, 'usr-2')).corpo.solicitacoes;
  const sol = recebidas.find((s) => s.id === 'sol-3');
  assert.equal(sol.recebida, true);
  assert.equal(sol.status, 'pendente');

  assert.equal((await api('POST', '/solicitacoes/sol-3/resposta', { aceitar: true }, 'usr-1')).status, 404);
  assert.equal((await api('POST', '/solicitacoes/sol-3/resposta', {}, 'usr-2')).status, 400);
  const r = await api('POST', '/solicitacoes/sol-3/resposta', { aceitar: true }, 'usr-2');
  assert.equal(r.corpo.status, 'aceita');
  assert.equal((await api('POST', '/solicitacoes/sol-3/resposta', { aceitar: false }, 'usr-2')).status, 409);
  assert.ok((await api('GET', '/idosos', undefined, 'usr-2')).corpo.some((i) => i.id === 'ido-2'));

  const daFamilia = (await api('GET', '/avisos', undefined, 'usr-5')).corpo.solicitacoes.find((s) => s.id === 'sol-3');
  assert.equal(daFamilia.recebida, false);
  assert.equal(daFamilia.status, 'aceita');
  assert.equal(daFamilia.cuidadorNome, 'Ana Souza');
});

test('rede de apoio: telefones, responsável e remoção', async () => {
  const rede = (await api('GET', '/idosos/ido-1/rede')).corpo;
  const carla = rede.find((m) => m.id === 'usr-4');
  assert.equal(carla.responsavel, true);
  assert.ok(rede.find((m) => m.id === 'usr-1').telefone);

  /* cuidador não tira outra pessoa; responsável não sai; responsável tira o cuidador */
  assert.equal((await api('DELETE', '/idosos/ido-1/rede/usr-2', undefined, 'usr-1')).status, 403);
  assert.equal((await api('DELETE', '/idosos/ido-1/rede/usr-4', undefined, 'usr-4')).status, 400);
  assert.equal((await api('DELETE', '/idosos/ido-1/rede/usr-2', undefined, 'usr-4')).status, 204);
  assert.equal((await api('GET', '/idosos/ido-1/rede')).corpo.some((m) => m.id === 'usr-2'), false);
  assert.equal((await api('GET', '/idosos/ido-1', undefined, 'usr-2')).status, 403);

  /* o cuidador pode sair sozinho */
  assert.equal((await api('DELETE', '/idosos/ido-1/rede/usr-1', undefined, 'usr-1')).status, 204);
  assert.equal((await api('DELETE', '/idosos/ido-1/rede/usr-1', undefined, 'usr-4')).status, 404);
});

test('validações', async () => {
  assert.equal((await api('GET', '/idosos/ido-1/dias/2026-02-30')).status, 400);
  assert.equal((await api('PATCH', DIA + '/itens/med-2', { status: 'tomei' })).status, 400);
  assert.equal((await api('PATCH', DIA + '/itens/med-2', { horarioAdiado: '25:00' })).status, 400);
  assert.equal((await api('PATCH', DIA + '/itens/med-2', {})).status, 400);
  assert.equal((await api('PATCH', DIA + '/itens/tar-2', { status: 'feito' })).status, 404);
  assert.equal((await api('POST', DIA + '/anotacoes', { hora: '10:00', texto: '   ' })).status, 400);
  assert.equal((await api('POST', '/idosos/ido-1/medicamentos', { nome: 'X', dosagem: '1', forma: 'Bala', via: 'Oral', horarios: ['08:00'] })).status, 400);
  assert.equal((await api('POST', '/idosos/ido-1/tarefas', { horario: '08:00', titulo: 'X', diasSemana: [] })).status, 400);
  assert.equal((await api('PATCH', '/idosos/ido-1/chamados/cha-1', { status: 'atendido' })).status, 404);
  assert.equal((await api('GET', '/nada')).status, 404);

  const res = await fetch(base + '/idosos/ido-1/chamados', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(res.status, 400);
});
