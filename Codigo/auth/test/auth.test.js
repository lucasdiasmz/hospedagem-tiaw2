import assert from 'node:assert/strict';
import { test } from 'node:test';

process.env.AUTH_SECRET = 'segredo-de-teste-com-mais-de-32-caracteres';

const { autenticar, idososDoUsuario, membrosDaRede, papelDe, temAcesso } = await import('../acesso.js');
const { criarLimite } = await import('../limite.js');
const { repoJson } = await import('../repos.js');
const { conferirSenha, gerarHash } = await import('../senha.js');
const { COOKIE, cookieDeEntrada, criarToken, lerCookie, lerToken } = await import('../sessao.js');

test('senha: confere a certa, recusa a errada e a conta sem senha', async () => {
  const hash = await gerarHash('minha senha boa');
  assert.ok(hash.startsWith('scrypt$'));
  assert.equal(await conferirSenha('minha senha boa', hash), true);
  assert.equal(await conferirSenha('outra', hash), false);
  assert.equal(await conferirSenha('', ''), false);
  assert.notEqual(hash, await gerarHash('minha senha boa'));
});

test('token: recusa adulterado, vencido e malformado', () => {
  const t = criarToken('usr-1', 2);
  assert.deepEqual(lerToken(t), { usuarioId: 'usr-1', versao: 2 });
  const [corpo, assinatura] = t.split('.');
  const outro = Buffer.from(JSON.stringify({ u: 'usr-4', v: 2, e: 9e12 })).toString('base64url');
  assert.equal(lerToken(outro + '.' + assinatura), null);
  assert.equal(lerToken(corpo + '.'), null);
  assert.equal(lerToken(corpo + '.' + assinatura + '.x'), null);
  assert.equal(lerToken(criarToken('usr-1', 0, Date.now() - 8 * 24 * 3600 * 1000)), null);
  assert.equal(lerToken(undefined), null);
});

test('cookie: HttpOnly e SameSite; Secure só publicado', () => {
  assert.match(cookieDeEntrada({ id: 'usr-1' }), /HttpOnly; SameSite=Lax$/);
  process.env.NODE_ENV = 'production';
  assert.match(cookieDeEntrada({ id: 'usr-1' }), /; Secure$/);
  delete process.env.NODE_ENV;
  assert.equal(lerCookie('a=1; ' + cookieDeEntrada({ id: 'usr-1' }).split(';')[0]).usuarioId, 'usr-1');
  assert.equal(lerCookie('x' + COOKIE + '=' + criarToken('usr-1')), null);
});

test('acesso: cada um vê só os seus idosos', async () => {
  const repo = repoJson();
  const ids = async (u) => (await idososDoUsuario(repo, await repo.buscar('usuarios', u))).map((i) => i.id).sort();
  assert.deepEqual(await ids('usr-1'), ['ido-1', 'ido-2']);
  assert.deepEqual(await ids('usr-2'), ['ido-1']);
  assert.deepEqual(await ids('usr-5'), ['ido-2']);
  const ana = await repo.buscar('usuarios', 'usr-2');
  assert.equal(await temAcesso(repo, ana, 'ido-2'), false);
  assert.equal(await temAcesso(repo, ana, { $ne: null }), false);
});

test('familiar convidado entra pelo vínculo com clienteId', async () => {
  const base = repoJson();
  const repo = {
    buscar: base.buscar,
    listar: async (c, f) => (c === 'vinculos' && f.clienteId === 'cli-2'
      ? [{ idosoId: 'ido-1', clienteId: 'cli-2', ativo: true }]
      : base.listar(c, f)),
  };
  const paulo = await base.buscar('usuarios', 'usr-5');
  assert.deepEqual((await idososDoUsuario(repo, paulo)).map((i) => i.id).sort(), ['ido-1', 'ido-2']);
});

test('papel e rede', async () => {
  assert.equal(papelDe({ tipo: 'cuidador' }, {}), 'cuidador');
  assert.equal(papelDe({ tipo: 'cliente' }, { relacao: 'proprio' }), 'idoso');
  assert.equal(papelDe({ tipo: 'cliente' }, { relacao: 'familiar' }), 'cliente');
  const repo = repoJson();
  const rede = await membrosDaRede(repo, await repo.buscar('idosos', 'ido-1'));
  assert.deepEqual(rede.map((m) => m.id).sort(), ['usr-1', 'usr-2', 'usr-4']);
});

test('autenticar: exige cookie válido e a versão atual da sessão; não devolve a senha', async () => {
  const repo = repoJson();
  const com = (t) => COOKIE + '=' + t;
  const quem = await autenticar(repo, com(criarToken('usr-4')));
  assert.equal(quem.papel, 'cliente');
  assert.equal('senhaHash' in quem.usuario, false);
  assert.equal(await autenticar(repo, com(criarToken('usr-4', 1))), null);
  assert.equal(await autenticar(repo, com(criarToken('usr-999'))), null);
  assert.equal(await autenticar(repo, undefined), null);
});

test('limite de tentativas', () => {
  const l = criarLimite(2, 1000);
  l.contar('a', 0);
  l.contar('a', 0);
  assert.equal(l.estourou('a', 10), true);
  assert.equal(l.estourou('b', 10), false);
  assert.equal(l.estourou('a', 1001), false);
});
