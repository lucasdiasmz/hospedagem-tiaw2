/* Quem é a pessoa, qual o papel dela e quais idosos pode ver. Serve às 7 APIs.
   "repo" é qualquer objeto com listar(colecao, filtro) e buscar(colecao, id). */
import { lerCookie } from './sessao.js';

/* perfil de cuidador ou de cliente do usuário */
export async function buscarPerfil(repo, usuario) {
  const colecao = usuario.tipo === 'cuidador' ? 'cuidadores' : 'clientes';
  const [perfil] = await repo.listar(colecao, { usuarioId: usuario.id });
  return perfil || null;
}

/* papel nas telas: 'cuidador', 'idoso' (cliente de si mesmo) ou 'cliente' (familiar responsável) */
export function papelDe(usuario, perfil) {
  if (usuario.tipo === 'cuidador') return 'cuidador';
  return perfil?.relacao === 'proprio' ? 'idoso' : 'cliente';
}

/* cliente: os idosos que cadastrou e os que recebeu por convite; cuidador: os vínculos ativos */
export async function idososDoUsuario(repo, usuario) {
  const perfil = await buscarPerfil(repo, usuario);
  if (!perfil) return [];
  const cuidador = usuario.tipo === 'cuidador';
  const proprios = cuidador ? [] : await repo.listar('idosos', { clienteId: perfil.id });
  const vinculos = await repo.listar('vinculos', { [cuidador ? 'cuidadorId' : 'clienteId']: perfil.id, ativo: true });
  const ids = new Set(proprios.map((i) => i.id));
  const faltam = [...new Set(vinculos.map((v) => v.idosoId))].filter((id) => !ids.has(id));
  const vinculados = await Promise.all(faltam.map((id) => repo.buscar('idosos', id)));
  return [...proprios, ...vinculados.filter(Boolean)];
}

export async function temAcesso(repo, usuario, idosoId) {
  if (typeof idosoId !== 'string') return false;
  return (await idososDoUsuario(repo, usuario)).some((i) => i.id === idosoId);
}

/* todos da rede do idoso: [{ id, nome, papel }] (familiares e cuidadores com vínculo ativo) */
export async function membrosDaRede(repo, idoso) {
  const vinculos = await repo.listar('vinculos', { idosoId: idoso.id, ativo: true });
  const membros = new Map();

  async function incluir(colecao, perfilId, rotulo) {
    const perfil = perfilId && await repo.buscar(colecao, perfilId);
    const usuario = perfil && await repo.buscar('usuarios', perfil.usuarioId);
    if (usuario && !membros.has(usuario.id)) {
      membros.set(usuario.id, { id: usuario.id, nome: usuario.nome, papel: rotulo(perfil) });
    }
  }

  const familia = (c) => (c.relacao === 'proprio' ? 'Idoso(a)' : 'Familiar');
  await incluir('clientes', idoso.clienteId, familia);
  for (const v of vinculos) {
    if (v.clienteId) await incluir('clientes', v.clienteId, familia);
    else await incluir('cuidadores', v.cuidadorId, () => v.funcao || 'Cuidador(a)');
  }
  return [...membros.values()];
}

/* dados que podem sair para a tela */
export function semSegredos({ senhaHash, versaoSessao, ...usuario }) {
  return usuario;
}

/* { usuario, perfil, papel } de quem mandou o cookie, ou null */
export async function autenticar(repo, cabecalhoCookie) {
  const sessao = lerCookie(cabecalhoCookie);
  const usuario = sessao && await repo.buscar('usuarios', sessao.usuarioId);
  if (!usuario || (usuario.versaoSessao || 0) !== sessao.versao) return null;
  const perfil = await buscarPerfil(repo, usuario);
  return { usuario: semSegredos(usuario), perfil, papel: papelDe(usuario, perfil) };
}
