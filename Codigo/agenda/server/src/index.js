import { carregarSegredo } from '../../../auth/sessao.js';
import { criarApp } from './app.js';
import { criarRepositorio } from './repositorios/index.js';

const PORTA = Number(process.env.PORT) || 3002;

const repo = criarRepositorio();
await repo.conectar();

/* falha já na partida se faltar AUTH_SECRET */
carregarSegredo();
const app = criarApp(repo);
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
