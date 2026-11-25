import { Router } from 'express';
import { idososDoUsuario } from '../servicos/acesso.js';
import { agora } from '../servicos/tempo.js';
import { ErroHttp } from '../validacao.js';

/* pedidos de ajuda resolvidos continuam aparecendo por 12 horas, para quem pediu ver a resposta */
const MOSTRAR_RESOLVIDO = 12 * 60 * 60 * 1000;
/* respostas de solicitações aparecem para a família por 7 dias */
const MOSTRAR_RESPOSTA = 7 * 24 * 60 * 60 * 1000;

const recente = (iso, janela) => Boolean(iso) && Date.now() - new Date(iso).getTime() < janela;

/* nome de um usuário pelo id, com cache por requisição */
function nomes(repo) {
  const cache = new Map();
  return async (usuarioId) => {
    if (!usuarioId) return null;
    if (!cache.has(usuarioId)) cache.set(usuarioId, repo.buscar('usuarios', usuarioId).then((u) => u?.nome || null));
    return cache.get(usuarioId);
  };
}

async function usuarioDoPerfil(repo, colecao, perfilId) {
  const perfil = perfilId && await repo.buscar(colecao, perfilId);
  return perfil?.usuarioId || null;
}

/* Avisos de quem está logado: pedidos de ajuda dos idosos que acompanha e as solicitações
   de atendimento (o cuidador recebe e responde; a família acompanha a resposta). */
export function rotasAvisos(repo) {
  const r = Router();

  r.get('/avisos', async (req, res) => {
    const nome = nomes(repo);
    const idosos = await idososDoUsuario(repo, req.usuario);

    const chamados = [];
    for (const idoso of idosos) {
      for (const c of await repo.listar('chamadosAjuda', { idosoId: idoso.id })) {
        const aberto = c.status !== 'atendido';
        if (!aberto && !recente(c.atendidoEm, MOSTRAR_RESOLVIDO)) continue;
        chamados.push({
          id: c.id,
          idosoId: idoso.id,
          idosoNome: idoso.nome,
          abertoPor: c.abertoPor,
          abertoPorNome: await nome(c.abertoPor),
          meu: c.abertoPor === req.usuario.id,
          dataHora: c.dataHora,
          mensagem: c.mensagem || '',
          status: aberto ? (c.indoPor ? 'a-caminho' : 'aberto') : 'atendido',
          indoPorNome: await nome(c.indoPor),
          euVou: c.indoPor === req.usuario.id,
          atendidoPorNome: await nome(c.atendidoPor),
        });
      }
    }

    const solicitacoes = [];
    if (req.perfil) {
      const campo = req.papel === 'cuidador' ? 'cuidadorId' : 'clienteId';
      for (const s of await repo.listar('solicitacoes', { [campo]: req.perfil.id })) {
        const pendente = s.status === 'pendente';
        if (!pendente && !recente(s.respondidaEm, MOSTRAR_RESPOSTA)) continue;
        const idoso = await repo.buscar('idosos', s.idosoId);
        solicitacoes.push({
          id: s.id,
          recebida: req.papel === 'cuidador',
          status: s.status,
          idosoNome: idoso?.nome || '',
          familiaNome: await nome(await usuarioDoPerfil(repo, 'clientes', s.clienteId)),
          cuidadorNome: await nome(await usuarioDoPerfil(repo, 'cuidadores', s.cuidadorId)),
          servico: s.servico,
          data: s.data,
          horaInicio: s.horaInicio,
          horaFim: s.horaFim,
          mensagem: s.mensagem || '',
          criadaEm: s.criadaEm,
        });
      }
    }

    chamados.sort((a, b) => b.dataHora.localeCompare(a.dataHora));
    solicitacoes.sort((a, b) => (b.criadaEm || '').localeCompare(a.criadaEm || ''));
    res.json({ chamados, solicitacoes });
  });

  /* o cuidador aceita ou recusa; aceitar já coloca o cuidador na rede do idoso */
  r.post('/solicitacoes/:id/resposta', async (req, res) => {
    const s = await repo.buscar('solicitacoes', req.params.id);
    if (!s || req.papel !== 'cuidador' || s.cuidadorId !== req.perfil?.id) throw new ErroHttp(404, 'Solicitação não encontrada');
    if (typeof req.body?.aceitar !== 'boolean') throw new ErroHttp(400, 'Informe se aceita a solicitação');
    if (s.status !== 'pendente') throw new ErroHttp(409, 'Esta solicitação já foi respondida');

    const status = req.body.aceitar ? 'aceita' : 'recusada';
    const atualizada = await repo.atualizarSe('solicitacoes', { id: s.id, status: 'pendente' }, { status, respondidaEm: agora() });
    if (!atualizada) throw new ErroHttp(409, 'Esta solicitação já foi respondida');

    if (req.body.aceitar) {
      const [vinculo] = await repo.listar('vinculos', { idosoId: s.idosoId, cuidadorId: s.cuidadorId });
      if (vinculo) {
        if (!vinculo.ativo) await repo.atualizar('vinculos', vinculo.id, { ativo: true });
      } else {
        await repo.inserir('vinculos', {
          idosoId: s.idosoId,
          cuidadorId: s.cuidadorId,
          funcao: 'Cuidador(a)',
          turno: '',
          ativo: true,
          origemAgendamentoId: null,
          origemSolicitacaoId: s.id,
        });
      }
    }
    res.json(atualizada);
  });

  return r;
}
