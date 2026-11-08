/* Dados do JSON global do projeto (Codigo/db/db.json) */
import db from '../../../db/db.json';

export const CATALOGOS = db.catalogos;
export const IDOSOS = db.idosos;

/* quem está usando o sistema: a cuidadora Maria Silva (usr-1) */
const logado = db.usuarios.find((u) => u.id === 'usr-1');
export const USUARIO = {
  id: logado.id,
  nome: logado.nome.split(' ')[0],
  nomeCompleto: logado.nome,
  papel: 'Cuidador(a)',
};

/*
  Rede de apoio de um idoso: o familiar responsável (cliente)
  e os cuidadores com vínculo ativo.
*/
export function membrosDaRede(idosoId) {
  const idoso = db.idosos.find((i) => i.id === idosoId);
  const cliente = db.clientes.find((c) => c.id === idoso.clienteId);
  const familiar = db.usuarios.find((u) => u.id === cliente.usuarioId);

  const membros = [{ id: familiar.id, nome: familiar.nome, papel: 'Familiar' }];

  db.vinculos
    .filter((v) => v.idosoId === idosoId && v.ativo)
    .forEach((v) => {
      const cuidador = db.cuidadores.find((c) => c.id === v.cuidadorId);
      const usuario = db.usuarios.find((u) => u.id === cuidador.usuarioId);
      membros.push({ id: usuario.id, nome: usuario.nome, papel: v.funcao });
    });

  return membros;
}
