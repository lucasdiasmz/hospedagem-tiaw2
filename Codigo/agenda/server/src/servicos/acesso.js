import { idososDoUsuario } from '../../../../auth/acesso.js';
import { ErroHttp } from '../validacao.js';

export { idososDoUsuario } from '../../../../auth/acesso.js';

/* o idoso, se existir e o usuário tiver acesso a ele */
export async function exigirAcesso(repo, usuario, idosoId) {
  const idoso = await repo.buscar('idosos', idosoId);
  if (!idoso) throw new ErroHttp(404, 'Idoso não encontrado');
  const permitidos = await idososDoUsuario(repo, usuario);
  if (!permitidos.some((i) => i.id === idosoId)) throw new ErroHttp(403, 'Sem acesso a este idoso');
  return idoso;
}

