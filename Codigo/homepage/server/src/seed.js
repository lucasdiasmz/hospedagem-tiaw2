import { MongoClient } from 'mongodb';
import { COLECOES, lerDadosIniciais } from './dados/db.js';
import { criarRepositorioMongo } from './repositorios/mongo.js';

/* Cria (ou recria) o banco MongoDB a partir de Codigo/db/db.json.
   npm run seed            → apaga as coleções do db.json e carrega tudo de novo
   Usa MONGODB_URI e MONGODB_DB do .env, como o servidor. */
const uri = process.env.MONGODB_URI;
const nomeBanco = process.env.MONGODB_DB || 'acessamob';
if (!uri) {
  console.error('Defina MONGODB_URI no .env (veja .env.example).');
  process.exit(1);
}

const cliente = new MongoClient(uri);
await cliente.connect();
const db = cliente.db(nomeBanco);
for (const nome of [...COLECOES, 'catalogos']) await db.collection(nome).drop().catch(() => {});
await cliente.close();

/* com as coleções vazias, o repositório cria os índices e popula tudo com o db.json */
const repo = criarRepositorioMongo(uri, nomeBanco);
await repo.conectar();
await repo.fechar();

const dados = lerDadosIniciais();
console.log(`Banco "${nomeBanco}" criado a partir do db.json:`);
for (const nome of COLECOES) console.log(`  ${nome}: ${dados[nome]?.length || 0}`);
console.log('  catalogos: 1');
