import { MongoClient } from 'mongodb';
import { COLECOES, lerDadosIniciais, novoId } from '../dados/db.js';

/* Uma coleção do MongoDB para cada lista de db.json (usuarios, idosos, medicamentos...).
   O "id" do db.json vira o _id (string), e os catálogos ficam num documento só em "catalogos". */

function paraMongo(filtro) {
  const { id, ...resto } = filtro;
  return id === undefined ? resto : { _id: id, ...resto };
}

function semMongoId(doc) {
  if (!doc) return null;
  const { _id, ...resto } = doc;
  return { id: _id, ...resto };
}

/* { a: 1, b: null } → { $set: { a: 1 }, $unset: { b: '' } } */
function operacoes(mudanca) {
  const op = {};
  Object.entries(mudanca).forEach(([k, v]) => {
    if (v === null) (op.$unset ||= {})[k] = '';
    else (op.$set ||= {})[k] = v;
  });
  return op;
}

export function criarRepositorioMongo(uri, nomeBanco) {
  const cliente = new MongoClient(uri);
  let db;

  const col = (nome) => db.collection(nome);

  return {
    tipo: 'mongo',

    async conectar() {
      await cliente.connect();
      db = cliente.db(nomeBanco);

      await col('registros').createIndex(
        { idosoId: 1, data: 1, tipo: 1, itemId: 1, horarioPrevisto: 1 },
        { unique: true },
      );
      await col('anotacoes').createIndex({ idosoId: 1, data: 1 });
      await col('usuarios').createIndex({ email: 1 }, { unique: true });
      await col('convites').createIndex({ codigoHash: 1 }, { unique: true });

      /* popula as coleções vazias com db.json */
      const dados = lerDadosIniciais();
      for (const nome of COLECOES) {
        if (dados[nome]?.length && !(await col(nome).estimatedDocumentCount())) {
          await col(nome).insertMany(dados[nome].map(paraMongo));
        }
      }
      await col('catalogos').updateOne({ _id: 'catalogos' }, { $setOnInsert: dados.catalogos }, { upsert: true });
    },

    async fechar() {
      await cliente.close();
    },

    async buscarCatalogos() {
      const { _id, ...catalogos } = await col('catalogos').findOne({ _id: 'catalogos' });
      return catalogos;
    },

    async listar(colecao, filtro = {}) {
      return (await col(colecao).find(paraMongo(filtro)).toArray()).map(semMongoId);
    },

    async buscar(colecao, id) {
      return semMongoId(await col(colecao).findOne({ _id: id }));
    },

    async inserir(colecao, dados) {
      const doc = { _id: novoId(colecao), ...dados };
      await col(colecao).insertOne(doc);
      return semMongoId(doc);
    },

    async atualizar(colecao, id, mudanca) {
      const doc = await col(colecao).findOneAndUpdate({ _id: id }, operacoes(mudanca), { returnDocument: 'after' });
      return semMongoId(doc);
    },

    /* atualiza só se o documento ainda combinar com o filtro (uma operação só no banco) */
    async atualizarSe(colecao, filtro, mudanca) {
      const doc = await col(colecao).findOneAndUpdate(paraMongo(filtro), operacoes(mudanca), { returnDocument: 'after' });
      return semMongoId(doc);
    },

    async remover(colecao, id) {
      const { deletedCount } = await col(colecao).deleteOne({ _id: id });
      return deletedCount > 0;
    },

    async salvarRegistro(chave, mudanca) {
      const op = operacoes(mudanca);
      op.$setOnInsert = { _id: novoId('registros') };
      const doc = await col('registros').findOneAndUpdate(chave, op, { upsert: true, returnDocument: 'after' });
      return semMongoId(doc);
    },
  };
}
