import { ErroHttp } from '../validacao.js';

/* A rede de um idoso com o que a tela "Rede de apoio" precisa: telefone para ligar,
   a função de cada um e se a pessoa pode ser removida (quem cadastrou o idoso, não). */
export async function redeDetalhada(repo, idoso) {
  const membros = new Map();

  async function incluir(colecao, perfilId, extra) {
    const perfil = perfilId && await repo.buscar(colecao, perfilId);
    const usuario = perfil && await repo.buscar('usuarios', perfil.usuarioId);
    if (!usuario || membros.has(usuario.id)) return;
    const familia = colecao === 'clientes';
    membros.set(usuario.id, {
      id: usuario.id,
      nome: usuario.nome,
      telefone: usuario.telefone || '',
      tipo: familia ? (perfil.relacao === 'proprio' ? 'idoso' : 'familia') : 'cuidador',
      papel: familia ? (perfil.relacao === 'proprio' ? 'Idoso(a)' : 'Familiar') : extra.funcao || 'Cuidador(a)',
      turno: extra.turno || '',
      responsavel: Boolean(extra.responsavel),
    });
  }

  await incluir('clientes', idoso.clienteId, { responsavel: true });
  for (const v of await repo.listar('vinculos', { idosoId: idoso.id, ativo: true })) {
    if (v.clienteId) await incluir('clientes', v.clienteId, {});
    else await incluir('cuidadores', v.cuidadorId, v);
  }
  /* idoso primeiro, depois família, depois cuidadores */
  const ordem = { idoso: 0, familia: 1, cuidador: 2 };
  return [...membros.values()].sort((a, b) => ordem[a.tipo] - ordem[b.tipo] || Number(b.responsavel) - Number(a.responsavel));
}

/* Tira alguém da rede (desativa os vínculos). Quem cadastrou o idoso e o próprio idoso
   podem tirar outras pessoas; qualquer um pode sair. O responsável não sai da rede. */
export async function removerDaRede(repo, idoso, quem, usuarioId) {
  const alvo = await repo.buscar('usuarios', usuarioId);
  if (!alvo) throw new ErroHttp(404, 'Pessoa não encontrada na rede');

  const sairSozinho = usuarioId === quem.usuario.id;
  const responsavel = idoso.clienteId && quem.perfil?.id === idoso.clienteId;
  if (!sairSozinho && !responsavel && quem.papel !== 'idoso') {
    throw new ErroHttp(403, 'Só quem cadastrou a pessoa cuidada pode tirar alguém da rede');
  }

  const colecao = alvo.tipo === 'cuidador' ? 'cuidadores' : 'clientes';
  const [perfil] = await repo.listar(colecao, { usuarioId });
  if (!perfil) throw new ErroHttp(404, 'Pessoa não encontrada na rede');
  if (colecao === 'clientes' && perfil.id === idoso.clienteId) {
    throw new ErroHttp(400, 'Quem cadastrou a pessoa cuidada não pode sair da rede');
  }

  const campo = colecao === 'cuidadores' ? 'cuidadorId' : 'clienteId';
  const vinculos = await repo.listar('vinculos', { idosoId: idoso.id, [campo]: perfil.id, ativo: true });
  if (!vinculos.length) throw new ErroHttp(404, 'Pessoa não encontrada na rede');
  for (const v of vinculos) await repo.atualizar('vinculos', v.id, { ativo: false });
}
