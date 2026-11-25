import { createHash, randomInt } from 'node:crypto';
import { ErroHttp } from '../validacao.js';
import { agora } from './tempo.js';

/* sem 0/O, 1/I/L: o código é ditado por telefone e digitado por idosos */
const LETRAS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const VALIDADE = 7 * 24 * 60 * 60 * 1000;

const limpar = (codigo) => String(codigo).toUpperCase().replace(/[^A-Z0-9]/g, '');
/* no banco fica só o hash do código */
const hashDe = (codigo) => createHash('sha256').update(limpar(codigo)).digest('hex');

/* devolve o código em texto, que só aparece agora: "ABCD-EFGH" */
export async function criarConvite(repo, idoso, papel, usuario) {
  const codigo = Array.from({ length: 8 }, () => LETRAS[randomInt(LETRAS.length)]).join('');
  const expiraEm = new Date(Date.now() + VALIDADE).toISOString();
  await repo.inserir('convites', {
    codigoHash: hashDe(codigo),
    idosoId: idoso.id,
    papel,
    criadoPor: usuario.id,
    criadoEm: agora(),
    expiraEm,
    usadoPor: null,
  });
  return { codigo: codigo.slice(0, 4) + '-' + codigo.slice(4), papel, expiraEm };
}

const NOMES = { idoso: 'idoso(a)', cliente: 'familiar', cuidador: 'cuidador(a)' };

export async function buscarConvite(repo, codigo, papel) {
  const [convite] = await repo.listar('convites', { codigoHash: hashDe(codigo) });
  if (!convite || convite.usadoPor || convite.expiraEm < new Date().toISOString()) {
    throw new ErroHttp(400, 'Convite inválido ou vencido');
  }
  if (convite.papel !== papel) throw new ErroHttp(400, 'Este convite é para ' + NOMES[convite.papel]);
  return convite;
}

/* liga a pessoa ao idoso do convite; cada convite vale uma vez */
export async function usarConvite(repo, convite, { usuario, perfil, papel }) {
  const marcado = await repo.atualizarSe('convites', { id: convite.id, usadoPor: null }, { usadoPor: usuario.id });
  if (!marcado) throw new ErroHttp(400, 'Convite inválido ou vencido');
  const campo = papel === 'cuidador' ? 'cuidadorId' : 'clienteId';
  const [existente] = await repo.listar('vinculos', { idosoId: convite.idosoId, [campo]: perfil.id, ativo: true });
  if (existente) return existente;
  return repo.inserir('vinculos', {
    idosoId: convite.idosoId,
    [campo]: perfil.id,
    funcao: papel === 'cuidador' ? 'Cuidador(a)' : papel === 'idoso' ? 'Idoso(a)' : 'Familiar',
    turno: '',
    ativo: true,
    origemAgendamentoId: null,
  });
}
