/* Carrega as tarefas da rede de apoio do db.json no MongoDB (apaga as que já existem na coleção) */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';
import TarefaRede from '../src/models/TarefaRede.js';

if (!process.env.MONGODB_URI) {
  console.error('Defina MONGODB_URI no arquivo .env (veja o .env.example).');
  process.exit(1);
}

const db = JSON.parse(readFileSync(new URL('../../db/db.json', import.meta.url), 'utf-8'));

await mongoose.connect(process.env.MONGODB_URI);
await TarefaRede.deleteMany({});
await TarefaRede.insertMany(db.tarefasRede);
console.log(db.tarefasRede.length + ' tarefas carregadas.');
await mongoose.disconnect();
