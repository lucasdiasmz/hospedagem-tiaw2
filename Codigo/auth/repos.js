/* Leitores mínimos (listar e buscar) para as APIs que não têm repositório próprio */
import { readFileSync } from 'node:fs';

const comId = ({ _id, ...resto }) => ({ ...resto, id: resto.id ?? String(_id) });

/* obterDb: função que devolve o Db do driver do MongoDB já conectado */
export function repoMongo(obterDb) {
  return {
    async listar(colecao, filtro = {}) {
      return (await obterDb().collection(colecao).find(filtro).toArray()).map(comId);
    },
    async buscar(colecao, id) {
      const doc = await obterDb().collection(colecao).findOne({ _id: String(id) });
      return doc ? comId(doc) : null;
    },
  };
}

/* sem banco (só no computador): o db.json global */
export function repoJson(caminho = new URL('../db/db.json', import.meta.url)) {
  const db = JSON.parse(readFileSync(caminho, 'utf8'));
  return {
    async listar(colecao, filtro = {}) {
      return (db[colecao] || []).filter((d) => Object.entries(filtro).every(([k, v]) => d[k] === v));
    },
    async buscar(colecao, id) {
      return (db[colecao] || []).find((d) => d.id === id) || null;
    },
  };
}
