/* Dados do JSON global do projeto (Codigo/db/db.json) */
import db from '../../../db/db.json';

export const CATALOGOS = db.catalogos;
export const IDOSOS = db.idosos;
export const MEDICAMENTOS_INICIAIS = db.medicamentos;

/* quem está usando o sistema: a cuidadora Maria Silva (usr-1) */
const logado = db.usuarios.find((u) => u.id === 'usr-1');
export const USUARIO = {
  id: logado.id,
  nome: logado.nome.split(' ')[0],
  nomeCompleto: logado.nome,
  papel: 'Cuidador(a)',
};
