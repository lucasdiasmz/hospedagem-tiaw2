import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

/* Codigo/db/db.json: modelo de dados do projeto, usado para popular o banco vazio */
const CAMINHO_PADRAO = new URL('../../../../db/db.json', import.meta.url);

export function lerDadosIniciais(caminho = process.env.DB_SEED || CAMINHO_PADRAO) {
  return JSON.parse(readFileSync(caminho, 'utf8'));
}

/* prefixo dos ids de cada coleção, como em db.json ("usr-1", "med-3"...) */
export const PREFIXOS = {
  usuarios: 'usr',
  clientes: 'cli',
  cuidadores: 'cui',
  idosos: 'ido',
  vinculos: 'vin',
  medicamentos: 'med',
  consultas: 'con',
  tarefas: 'tar',
  registros: 'reg',
  anotacoes: 'not',
  solicitacoes: 'sol',
  agendamentos: 'agd',
  avaliacoes: 'ava',
  chamadosAjuda: 'cha',
};

export const COLECOES = Object.keys(PREFIXOS);

export function novoId(colecao) {
  return PREFIXOS[colecao] + '-' + randomUUID().slice(0, 8);
}
