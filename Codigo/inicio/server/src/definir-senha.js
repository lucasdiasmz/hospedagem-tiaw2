/* Define a senha de uma conta que já existe e encerra as sessões abertas dela.
   Uso (com o MONGODB_URI do banco no .env):  npm run senha -- carla.ribeiro@email.com
   A senha é digitada no terminal, para não ficar no histórico de comandos. */
import { createInterface } from 'node:readline/promises';
import { gerarHash } from '../../../auth/senha.js';
import { criarRepositorioMongo } from './repositorios/mongo.js';

const email = String(process.argv[2] || '').trim().toLowerCase();
if (!email || !process.env.MONGODB_URI) {
  console.error('Uso: npm run senha -- email@exemplo.com  (com MONGODB_URI no .env)');
  process.exit(1);
}

const terminal = createInterface({ input: process.stdin, output: process.stdout });
const senha = await terminal.question('Nova senha (8 caracteres ou mais): ');
terminal.close();
if (senha.length < 8) {
  console.error('A senha precisa ter pelo menos 8 caracteres.');
  process.exit(1);
}

const repo = criarRepositorioMongo(process.env.MONGODB_URI, process.env.MONGODB_DB || 'acessamob');
await repo.conectar();
const [usuario] = await repo.listar('usuarios', { email });
if (!usuario) {
  console.error('Nenhuma conta com este e-mail.');
  process.exitCode = 1;
} else {
  await repo.atualizar('usuarios', usuario.id, {
    senhaHash: await gerarHash(senha),
    versaoSessao: (usuario.versaoSessao || 0) + 1,
  });
  console.log('Senha definida para ' + usuario.nome + '.');
}
await repo.fechar();
