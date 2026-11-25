import express from 'express';
import { rotasIdosos } from './rotas/idosos.js';
import { rotasAuth } from './rotas/auth.js';
import { rotasAvisos } from './rotas/avisos.js';
import { ErroHttp } from './validacao.js';
import { exigirLogin } from '../../../auth/express.js';

/* Monta a API sobre um repositório (memória ou MongoDB) */
export function criarApp(repo) {
  const app = express();
  app.disable('x-powered-by');
  /* a Vercel e o Render ficam na frente: o IP de quem chamou vem no X-Forwarded-For */
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '50kb' }));

  app.get('/api/saude', (req, res) => res.json({ ok: true, banco: repo.tipo }));

  app.get('/api/catalogos', async (req, res) => {
    res.json(await repo.buscarCatalogos());
  });

  app.use('/api/auth', rotasAuth(repo));

  /* daqui para baixo, só com a sessão (cookie assinado; Codigo/auth) */
  app.use('/api', exigirLogin(repo));

  /* usuário logado com o perfil de cuidador ou cliente */
  app.get('/api/usuarios/eu', (req, res) => {
    res.json({ ...req.usuario, perfil: req.perfil, papel: req.papel });
  });

  app.use('/api/idosos', rotasIdosos(repo));
  app.use('/api', rotasAvisos(repo));

  app.use('/api', (req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
  });

  app.use((err, req, res, next) => {
    if (err instanceof ErroHttp) return res.status(err.status).json({ erro: err.message });
    if (err.code === 11000 && err.keyPattern?.email) return res.status(409).json({ erro: 'Já existe uma conta com este e-mail' });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  });

  return app;
}
