import { ErroHttp } from '../validacao.js';

/* perfil de cuidador ou de cliente do usuário */
export async function buscarPerfil(repo, usuario) {
  const colecao = usuario.tipo === 'cuidador' ? 'cuidadores' : 'clientes';
  const [perfil] = await repo.listar(colecao, { usuarioId: usuario.id });
  return perfil || null;
}

/* idosos que o usuário acompanha: cuidador pelos vínculos ativos, cliente pelos que cadastrou */
export async function idososDoUsuario(repo, usuario) {
  const perfil = await buscarPerfil(repo, usuario);
  if (!perfil) return [];
  if (usuario.tipo === 'cliente') return repo.listar('idosos', { clienteId: perfil.id });

  const vinculos = await repo.listar('vinculos', { cuidadorId: perfil.id, ativo: true });
  const idosos = await Promise.all(vinculos.map((v) => repo.buscar('idosos', v.idosoId)));
  return idosos.filter(Boolean);
}

/* o idoso, se existir e o usuário tiver acesso a ele */
export async function exigirAcesso(repo, usuario, idosoId) {
  const idoso = await repo.buscar('idosos', idosoId);
  if (!idoso) throw new ErroHttp(404, 'Idoso não encontrado');
  const permitidos = await idososDoUsuario(repo, usuario);
  if (!permitidos.some((i) => i.id === idosoId)) throw new ErroHttp(403, 'Sem acesso a este idoso');
  return idoso;
}

/* quem recebe um chamado de ajuda: o cliente responsável e os cuidadores com vínculo ativo */
export async function interessados(repo, idoso) {
  const ids = [];
  const cliente = await repo.buscar('clientes', idoso.clienteId);
  if (cliente) ids.push(cliente.usuarioId);

  const vinculos = await repo.listar('vinculos', { idosoId: idoso.id, ativo: true });
  for (const v of vinculos) {
    const cuidador = await repo.buscar('cuidadores', v.cuidadorId);
    if (cuidador) ids.push(cuidador.usuarioId);
  }
  return [...new Set(ids)];
}
