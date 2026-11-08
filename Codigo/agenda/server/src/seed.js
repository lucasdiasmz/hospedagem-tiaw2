import { MongoClient } from 'mongodb';
import { lerDadosIniciais } from './dados/db.js';

/* Recarrega SÓ as coleções da agenda (eventosAgenda e exames) a partir de Codigo/db/db.json.
   As outras coleções são da tela inicial e ficam como estão.
   Usa MONGODB_URI e MONGODB_DB do .env, como o servidor. */
const COLECOES_AGENDA = ['eventosAgenda', 'exames'];

const uri = process.env.MONGODB_URI;
const nomeBanco = process.env.MONGODB_DB || 'acessamob';
if (!uri) {
  console.error('Defina MONGODB_URI no .env (veja .env.example).');
  process.exit(1);
}

const dados = lerDadosIniciais();
const cliente = new MongoClient(uri);
await cliente.connect();
const db = cliente.db(nomeBanco);

console.log(`Coleções da agenda recarregadas no banco "${nomeBanco}":`);
for (const nome of COLECOES_AGENDA) {
  const docs = (dados[nome] || []).map(({ id, ...resto }) => ({ _id: id, ...resto }));
  await db.collection(nome).deleteMany({});
  if (docs.length) await db.collection(nome).insertMany(docs);
  console.log(`  ${nome}: ${docs.length}`);
}
await db.collection('eventosAgenda').createIndex({ idosoId: 1, data: 1 });
await cliente.close();
