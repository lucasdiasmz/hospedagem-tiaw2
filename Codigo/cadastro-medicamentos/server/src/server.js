import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import rotasMedicamentos from './routes/medicamentos.js';

/* porta 3003: 3001 e 3002 são dos backends da homepage e da agenda (ver Codigo/README.md) */
const PORTA = process.env.PORT || 3003;

if (!process.env.MONGODB_URI) {
  console.error('Defina MONGODB_URI no arquivo .env (veja o .env.example).');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

app.use('/medicamentos', rotasMedicamentos);

/* qualquer erro não tratado vira uma resposta 500 em JSON */
app.use((e, _req, res, _next) => {
  console.error(e);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

await mongoose.connect(process.env.MONGODB_URI);
console.log('Conectado ao MongoDB');
app.listen(PORTA, () => console.log('API em http://localhost:' + PORTA));
