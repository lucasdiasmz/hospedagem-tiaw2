import assert from 'node:assert/strict';
import { after, beforeEach, test } from 'node:test';
import { COOKIE, criarToken } from '../../../auth/sessao.js';
import { criarApp } from '../src/app.js';
import { criarRepositorioMemoria } from '../src/repositorios/memoria.js';
import { criarRepositorioMongo } from '../src/repositorios/mongo.js';

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
  repo = MONGO ? criarRepositorioMongo(MONGO, `acessamob_auth_${Date.now()}_${n++}`) : criarRepositorioMemoria();
  await repo.conectar();
  servidor = criarApp(repo).listen(0);
  await new Promise((ok) => servidor.once('listening', ok));
  base = `http://localhost:${servidor.address().port}/api`;
});

after(fecharAtual);

async function api(metodo, caminho, corpo, cookie) {
  const res = await fetch(base + caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  const novo = res.headers.get('set-cookie');
  return {
    status: res.status,
    cookie: novo && novo.split(';')[0],
    bruto: novo,
    corpo: res.status === 204 ? null : await res.json(),
  };
}

const sessao = (id, v) => COOKIE + '=' + criarToken(id, v);
const SENHA = 'uma senha comprida';
const FAMILIAR = {
  nome: 'João Teste', email: 'Joao@Exemplo.com', senha: SENHA, papel: 'cliente', consentimento: true,
  idoso: { nome: 'Vera Teste', dataNascimento: '1948-05-02', mobilidade: 'andador' },
};
const CUIDADOR = {
  nome: 'Paula Teste', email: 'paula@exemplo.com', senha: SENHA, papel: 'cuidador', consentimento: true,
  cuidador: { experiencia: '1-3', servicos: ['companhia'], dias: ['seg'], inicio: '08:00', fim: '18:00' },
};

test('sem sessão nada responde, e o cabeçalho antigo não vale mais', async () => {
  for (const c of ['/usuarios/eu', '/idosos', '/idosos/ido-1', '/idosos/ido-1/dias/2026-10-27']) {
    assert.equal((await api('GET', c)).status, 401, c);
  }
  const res = await fetch(base + '/idosos', { headers: { 'X-Usuario-Id': 'usr-1' } });
  assert.equal(res.status, 401);
  assert.equal(res.headers.get('access-control-allow-origin'), null);
  assert.equal((await api('GET', '/saude')).status, 200);
});

test('familiar cria conta, entra e vê só o idoso que cadastrou', async () => {
  const criada = await api('POST', '/auth/cadastrar', FAMILIAR);
  assert.equal(criada.status, 201);
  assert.equal(criada.corpo.email, 'joao@exemplo.com');
  assert.equal(criada.corpo.papel, 'cliente');
  assert.equal('senhaHash' in criada.corpo, false);
  assert.match(criada.bruto, /HttpOnly/);

  const idosos = (await api('GET', '/idosos', undefined, criada.cookie)).corpo;
  assert.deepEqual(idosos.map((i) => i.nome), ['Vera Teste']);
  assert.equal(idosos[0].mobilidade.nivel, 'Parcial');
  assert.equal((await api('GET', '/idosos/ido-1', undefined, criada.cookie)).status, 403);

  const entrou = await api('POST', '/auth/entrar', { email: ' JOAO@exemplo.com ', senha: SENHA });
  assert.equal(entrou.status, 200);
  assert.equal((await api('GET', '/usuarios/eu', undefined, entrou.cookie)).corpo.nome, 'João Teste');
  assert.match((await api('POST', '/auth/sair')).bruto, /Max-Age=0/);
});

test('idoso cria a própria conta', async () => {
  const r = await api('POST', '/auth/cadastrar', {
    nome: 'Maria Teste', email: 'maria@exemplo.com', senha: SENHA, papel: 'idoso', consentimento: true,
    idoso: { dataNascimento: '1950-01-01', mobilidade: 'nenhuma' },
  });
  assert.equal(r.status, 201);
  assert.equal(r.corpo.papel, 'idoso');
  const [eu] = (await api('GET', '/idosos', undefined, r.cookie)).corpo;
  assert.equal(eu.nome, 'Maria Teste');
  const dia = '/idosos/' + eu.id + '/dias/2026-10-27/anotacoes';
  assert.equal((await api('POST', dia, { hora: '10:00', texto: 'oi' }, r.cookie)).status, 403);
  assert.equal((await api('POST', '/idosos', FAMILIAR.idoso, r.cookie)).status, 403);
});

test('cuidador novo não vê ninguém até receber convite, que vale uma vez', async () => {
  const paula = await api('POST', '/auth/cadastrar', CUIDADOR);
  assert.equal(paula.status, 201);
  assert.deepEqual((await api('GET', '/idosos', undefined, paula.cookie)).corpo, []);

  const convite = await api('POST', '/idosos/ido-1/convites', { papel: 'cuidador' }, sessao('usr-4'));
  assert.equal(convite.status, 201);
  assert.match(convite.corpo.codigo, /^[A-Z2-9]{4}-[A-Z2-9]{4}$/);
  assert.equal((await repo.listar('convites'))[0].codigoHash.length, 64);

  const usar = (codigo, cookie) => api('POST', '/idosos/entrar-com-convite', { codigo }, cookie);
  assert.equal((await usar('AAAA-AAAA', paula.cookie)).status, 400);
  assert.equal((await usar(convite.corpo.codigo, sessao('usr-5'))).status, 400, 'convite de cuidador não serve para familiar');
  assert.equal((await usar(convite.corpo.codigo.toLowerCase().replace('-', ' '), paula.cookie)).status, 201);
  assert.deepEqual((await api('GET', '/idosos', undefined, paula.cookie)).corpo.map((i) => i.id), ['ido-1']);
  assert.equal((await usar(convite.corpo.codigo, sessao('usr-3'))).status, 400);

  const rede = (await api('GET', '/idosos/ido-1/rede', undefined, paula.cookie)).corpo;
  assert.ok(rede.some((m) => m.nome === 'Paula Teste'));
});

test('convite vencido não vale; cuidador e estranho não convidam', async () => {
  const c = await api('POST', '/idosos/ido-1/convites', { papel: 'cliente' }, sessao('usr-4'));
  const [doc] = await repo.listar('convites');
  await repo.atualizar('convites', doc.id, { expiraEm: '2020-01-01T00:00:00.000Z' });
  assert.equal((await api('POST', '/idosos/entrar-com-convite', { codigo: c.corpo.codigo }, sessao('usr-5'))).status, 400);
  assert.equal((await api('POST', '/idosos/ido-1/convites', { papel: 'cliente' }, sessao('usr-1'))).status, 403);
  assert.equal((await api('POST', '/idosos/ido-1/convites', { papel: 'cliente' }, sessao('usr-5'))).status, 403);
});

test('dois usos ao mesmo tempo: só um vale', async () => {
  const c = await api('POST', '/idosos/ido-1/convites', { papel: 'cliente' }, sessao('usr-4'));
  const outro = await api('POST', '/auth/cadastrar', { ...FAMILIAR, idoso: undefined });
  const usar = (cookie) => api('POST', '/idosos/entrar-com-convite', { codigo: c.corpo.codigo }, cookie);
  const r = await Promise.all([usar(sessao('usr-5')), usar(outro.cookie)]);
  assert.deepEqual(r.map((x) => x.status).sort(), [201, 400]);
});

test('cadastro com convite liga ao idoso e não cria outro', async () => {
  const c = await api('POST', '/idosos/ido-1/convites', { papel: 'cliente' }, sessao('usr-4'));
  const r = await api('POST', '/auth/cadastrar', { ...FAMILIAR, convite: c.corpo.codigo });
  assert.equal(r.status, 201);
  assert.deepEqual((await api('GET', '/idosos', undefined, r.cookie)).corpo.map((i) => i.id), ['ido-1']);
});

test('validações do cadastro não deixam nada pela metade', async () => {
  const antes = (await repo.listar('usuarios')).length;
  const ruins = [
    { nome: '' }, { email: 'sem-arroba' }, { email: { $ne: null } }, { senha: 'curta' }, { papel: 'admin' },
    { consentimento: 'sim' }, { telefone: '00000000000' }, { convite: 'ZZZZ-ZZZZ' },
    { idoso: { nome: 'X', dataNascimento: '2999-01-01' } }, { idoso: { nome: 'X' } },
  ];
  for (const m of ruins) {
    assert.equal((await api('POST', '/auth/cadastrar', { ...FAMILIAR, ...m })).status, 400, JSON.stringify(m));
  }
  assert.equal((await api('POST', '/auth/cadastrar', { ...CUIDADOR, cuidador: { experiencia: '9' } })).status, 400);
  assert.equal((await api('POST', '/auth/cadastrar', { ...FAMILIAR, email: 'carla.ribeiro@email.com' })).status, 409);
  assert.equal((await repo.listar('usuarios')).length, antes);
});

test('senha errada, conta sem senha e excesso de tentativas', async () => {
  const entrar = (email, senha) => api('POST', '/auth/entrar', { email, senha });
  assert.equal((await entrar('carla.ribeiro@email.com', '')).status, 401, 'conta antiga, sem senha definida');
  assert.equal((await entrar('ninguem@exemplo.com', SENHA)).status, 401);
  await api('POST', '/auth/cadastrar', FAMILIAR);
  for (let i = 0; i < 8; i += 1) assert.equal((await entrar(FAMILIAR.email, 'errada')).status, 401);
  assert.equal((await entrar(FAMILIAR.email, SENHA)).status, 429);
});

test('mudar a senha derruba as sessões antigas', async () => {
  const r = await api('POST', '/auth/cadastrar', FAMILIAR);
  await repo.atualizar('usuarios', r.corpo.id, { versaoSessao: 1 });
  assert.equal((await api('GET', '/idosos', undefined, r.cookie)).status, 401);
  assert.equal((await api('GET', '/idosos', undefined, sessao(r.corpo.id, 1))).status, 200);
});

test('cuidador não mexe nos cadastros do idoso', async () => {
  const med = { nome: 'X', dosagem: '1', forma: 'Comprimido', via: 'Oral', horarios: ['08:00'] };
  assert.equal((await api('POST', '/idosos/ido-1/medicamentos', med, sessao('usr-1'))).status, 403);
  assert.equal((await api('GET', '/idosos/ido-1/medicamentos', undefined, sessao('usr-1'))).status, 200);
  assert.equal((await api('POST', '/idosos/ido-1/medicamentos', med, sessao('usr-4'))).status, 201);
});
