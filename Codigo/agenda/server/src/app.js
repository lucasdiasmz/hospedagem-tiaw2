import express from 'express';
import { rotasIdosos } from './rotas/idosos.js';
import { buscarPerfil } from './servicos/acesso.js';
import { ErroHttp } from './validacao.js';

/* Monta a API da agenda sobre um repositório (memória ou MongoDB) */
export function criarApp(repo, { usuarioPadrao = 'usr-1' } = {}) {
  const app = express();
  app.use(express.json());

  /* libera o site hospedado em outro endereço (CORS_ORIGIN; padrão: qualquer origem) */
  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, X-Usuario-Id');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  app.get('/api/saude', (req, res) => res.json({ ok: true, banco: repo.tipo }));

  app.get('/api/catalogos', async (req, res) => {
    res.json(await repo.buscarCatalogos());
  });

  /* Ainda não há login: o usuário vem do cabeçalho X-Usuario-Id (padrão: usr-1, Maria).
     Quando houver autenticação, basta trocar este middleware. */
  app.use('/api', async (req, res, next) => {
    const id = req.get('X-Usuario-Id') || usuarioPadrao;
    const usuario = await repo.buscar('usuarios', id);
    if (!usuario) throw new ErroHttp(401, 'Usuário não encontrado');
    const { senhaHash, ...semSenha } = usuario;
    req.usuario = semSenha;
    next();
  });

  /* usuário logado com o perfil de cuidador ou cliente */
  app.get('/api/usuarios/eu', async (req, res) => {
    res.json({ ...req.usuario, perfil: await buscarPerfil(repo, req.usuario) });
  });

  app.use('/api/idosos', rotasIdosos(repo));

  app.use('/api', (req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
  });

  app.use((err, req, res, next) => {
    if (err instanceof ErroHttp) return res.status(err.status).json({ erro: err.message });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  });

  return app;
}
