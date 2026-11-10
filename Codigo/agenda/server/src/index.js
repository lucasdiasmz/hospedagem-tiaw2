import { criarApp } from './app.js';
import { criarRepositorio } from './repositorios/index.js';

const PORTA = Number(process.env.PORT) || 3002;

const repo = criarRepositorio();
await repo.conectar();

const app = criarApp(repo, { usuarioPadrao: process.env.USUARIO_PADRAO || 'usr-1' });
const servidor = app.listen(PORTA, () => {
  console.log(`API da agenda do AcessaMob em http://localhost:${PORTA}/api (banco: ${repo.tipo})`);
});

async function encerrar() {
  servidor.close();
  await repo.fechar();
  process.exit(0);
}
process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);
