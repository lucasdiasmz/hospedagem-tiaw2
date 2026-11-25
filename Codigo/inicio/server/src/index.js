import { gerarHash } from '../../../auth/senha.js';
import { carregarSegredo } from '../../../auth/sessao.js';
import { criarApp } from './app.js';
import { criarRepositorio } from './repositorios/index.js';

const PORTA = Number(process.env.PORT) || 3001;

const repo = criarRepositorio();
await repo.conectar();

/* só em memória: SENHA_DEMO vale para as contas de exemplo do db.json, que não têm senha */
if (repo.tipo === 'memoria' && process.env.SENHA_DEMO) {
  const senhaHash = await gerarHash(process.env.SENHA_DEMO);
  for (const u of await repo.listar('usuarios')) await repo.atualizar('usuarios', u.id, { senhaHash });
}

/* falha já na partida se faltar AUTH_SECRET */
carregarSegredo();
const app = criarApp(repo);
const servidor = app.listen(PORTA, () => {
  console.log(`API do AcessaMob em http://localhost:${PORTA}/api (banco: ${repo.tipo})`);
});

async function encerrar() {
  servidor.close();
  await repo.fechar();
  process.exit(0);
}
process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);
