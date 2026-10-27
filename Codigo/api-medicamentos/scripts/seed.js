/* Carrega os medicamentos do db.json no MongoDB (apaga os que já existem na coleção) */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';
import Medicamento from '../src/models/Medicamento.js';

if (!process.env.MONGODB_URI) {
  console.error('Defina MONGODB_URI no arquivo .env (veja o .env.example).');
  process.exit(1);
}

const db = JSON.parse(readFileSync(new URL('../../db/db.json', import.meta.url), 'utf-8'));

await mongoose.connect(process.env.MONGODB_URI);
await Medicamento.deleteMany({});
await Medicamento.insertMany(db.medicamentos);
console.log(db.medicamentos.length + ' medicamentos carregados.');
await mongoose.disconnect();
