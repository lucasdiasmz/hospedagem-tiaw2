import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { idososDoUsuario, membrosDaRede } from '../../../auth/acesso.js';
import { exigirLogin } from '../../../auth/express.js';
import { carregarSegredo } from '../../../auth/sessao.js';
import { repo } from './repo.js';
import rotasTarefas from './routes/tarefasRede.js';

/* porta 3004 para poder rodar junto com as outras APIs (ver Codigo/README.md) */
const PORTA = process.env.PORT || 3004;

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
/* idosos da pessoa, cada um com a sua rede; "eu" diz qual membro é quem está usando */
app.get('/idosos', async (req, res, next) => {
  try {
    const lista = await idososDoUsuario(repo, req.usuario);
    res.json({
      eu: req.usuario.id,
      idosos: await Promise.all(lista.map(async (i) => ({
        id: i.id, nome: i.nome, apelido: i.apelido || i.nome.split(' ')[0], membros: await membrosDaRede(repo, i),
      }))),
    });
  } catch (e) {
    next(e);
  }
});
app.use('/tarefas-rede', rotasTarefas);

/* qualquer erro não tratado vira uma resposta 500 em JSON */
app.use((e, _req, res, _next) => {
  console.error(e);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

await mongoose.connect(process.env.MONGODB_URI);
console.log('Conectado ao MongoDB');
app.listen(PORTA, () => console.log('API em http://localhost:' + PORTA));
