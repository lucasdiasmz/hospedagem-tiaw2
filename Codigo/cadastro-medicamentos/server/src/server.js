import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { idososDoUsuario } from '../../../auth/acesso.js';
import { exigirLogin } from '../../../auth/express.js';
import { carregarSegredo } from '../../../auth/sessao.js';
import { repo } from './repo.js';
import rotasMedicamentos from './routes/medicamentos.js';

/* porta 3003: 3001 e 3002 são dos backends da homepage e da agenda (ver Codigo/README.md) */
const PORTA = process.env.PORT || 3003;

if (!process.env.MONGODB_URI) {
  console.error('Defina MONGODB_URI no arquivo .env (veja o .env.example).');
  process.exit(1);
}

carregarSegredo();
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '50kb' }));

app.get('/saude', (_req, res) => res.json({ ok: true }));

/* daqui para baixo, só com a sessão (cookie assinado; Codigo/auth) */
app.use(exigirLogin(repo));
app.get('/idosos', async (req, res, next) => {
  try {
    const lista = await idososDoUsuario(repo, req.usuario);
    res.json(lista.map(({ id, nome, apelido }) => ({ id, nome, apelido })));
  } catch (e) {
    next(e);
  }
});
app.use('/medicamentos', rotasMedicamentos);

/* qualquer erro não tratado vira uma resposta 500 em JSON */
app.use((e, _req, res, _next) => {
  console.error(e);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

await mongoose.connect(process.env.MONGODB_URI);
console.log('Conectado ao MongoDB');
app.listen(PORTA, () => console.log('API em http://localhost:' + PORTA));
