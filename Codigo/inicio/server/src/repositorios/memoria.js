import { COLECOES, lerDadosIniciais, novoId } from '../dados/db.js';

/* todos os campos do filtro iguais no documento */
function combina(doc, filtro) {
  return Object.entries(filtro).every(([k, v]) => doc[k] === v);
}

/* Repositório em memória, carregado de db.json: os dados somem quando o servidor reinicia.
   Tem exatamente os mesmos métodos do repositório MongoDB (mongo.js). */
export function criarRepositorioMemoria(dados = lerDadosIniciais()) {
  const db = structuredClone(dados);
  COLECOES.forEach((c) => { db[c] ||= []; });

  return {
    tipo: 'memoria',
    async conectar() {},
    async fechar() {},

    async buscarCatalogos() {
      return structuredClone(db.catalogos);
    },

    async listar(colecao, filtro = {}) {
      return db[colecao].filter((d) => combina(d, filtro)).map((d) => structuredClone(d));
    },

    async buscar(colecao, id) {
      const doc = db[colecao].find((d) => d.id === id);
      return doc ? structuredClone(doc) : null;
    },

    async inserir(colecao, dados) {
      const doc = { id: novoId(colecao), ...dados };
      db[colecao].push(doc);
      return structuredClone(doc);
    },

    /* define os campos de "mudanca"; os com valor null são apagados do documento */
    async atualizar(colecao, id, mudanca) {
      const doc = db[colecao].find((d) => d.id === id);
      if (!doc) return null;
      Object.entries(mudanca).forEach(([k, v]) => {
        if (v === null) delete doc[k];
        else doc[k] = v;
      });
      return structuredClone(doc);
    },

    /* atualiza só se o documento ainda combinar com o filtro */
    async atualizarSe(colecao, filtro, mudanca) {
      const doc = db[colecao].find((d) => combina(d, filtro));
      return doc ? this.atualizar(colecao, doc.id, mudanca) : null;
    },

    async remover(colecao, id) {
      const i = db[colecao].findIndex((d) => d.id === id);
      if (i < 0) return false;
      db[colecao].splice(i, 1);
      return true;
    },

    /* registro de um item num dia (chave: idosoId, data, tipo, itemId, horarioPrevisto), criado se não existir */
    async salvarRegistro(chave, mudanca) {
      let doc = db.registros.find((d) => combina(d, chave));
      if (!doc) {
        doc = { id: novoId('registros'), ...chave };
        db.registros.push(doc);
      }
      return this.atualizar('registros', doc.id, mudanca);
    },
  };
}
