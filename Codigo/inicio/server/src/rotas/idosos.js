import { Router } from 'express';
import { exigirPapel } from '../../../../auth/express.js';
import { criarLimite } from '../../../../auth/limite.js';
import { exigirAcesso, idososDoUsuario, interessados, membrosDaRede } from '../servicos/acesso.js';
import { buscarConvite, criarConvite, usarConvite } from '../servicos/convites.js';
import { montarDia } from '../servicos/dia.js';
import { criarIdoso, regrasIdoso } from '../servicos/idoso.js';
import { agora, horaAgora } from '../servicos/tempo.js';
import { ErroHttp, validarCorpo, validarData, validarHora, validarOpcao, validarTexto, validarTextoOpcional } from '../validacao.js';
import { rotasCadastros } from './cadastros.js';

export function rotasIdosos(repo) {
  const r = Router();

  /* idosos que o usuário logado acompanha */
  r.get('/', async (req, res) => {
    res.json(await idososDoUsuario(repo, req.usuario));
  });

  /* o familiar cadastra mais uma pessoa cuidada */
  r.post('/', exigirPapel(['cliente']), async (req, res) => {
    res.status(201).json(await criarIdoso(repo, req.perfil, validarCorpo(req.body || {}, regrasIdoso())));
  });

  /* entra na rede de um idoso com o código recebido */
  const tentativas = criarLimite(10);
  r.post('/entrar-com-convite', async (req, res) => {
    if (tentativas.estourou(req.usuario.id)) throw new ErroHttp(429, 'Muitas tentativas. Espere alguns minutos');
    tentativas.contar(req.usuario.id);
    const convite = await buscarConvite(repo, validarTexto(req.body?.codigo, 'Código', 20), req.papel);
    await usarConvite(repo, convite, { usuario: req.usuario, perfil: req.perfil, papel: req.papel });
    res.status(201).json(await repo.buscar('idosos', convite.idosoId));
  });

  /* todas as rotas com :idosoId exigem acesso ao idoso; ele fica em req.idoso */
  r.param('idosoId', async (req, res, next, idosoId) => {
    try {
      req.idoso = await exigirAcesso(repo, req.usuario, idosoId);
      next();
    } catch (e) {
      next(e);
    }
  });

  r.param('data', (req, res, next, data) => {
    validarData(data);
    next();
  });

  r.get('/:idosoId', (req, res) => {
    res.json(req.idoso);
  });

  r.get('/:idosoId/rede', async (req, res) => {
    res.json(await membrosDaRede(repo, req.idoso));
  });

  /* código para outra pessoa entrar na rede deste idoso; o idoso também pode convidar */
  r.post('/:idosoId/convites', exigirPapel(['cliente', 'idoso']), async (req, res) => {
    const papel = validarOpcao(req.body?.papel, ['cliente', 'cuidador', 'idoso'], 'Perfil');
    res.status(201).json(await criarConvite(repo, req.idoso, papel, req.usuario));
  });

  r.use('/:idosoId/medicamentos', rotasCadastros(repo, 'medicamentos'));
  r.use('/:idosoId/tarefas', rotasCadastros(repo, 'tarefas'));
  r.use('/:idosoId/consultas', rotasCadastros(repo, 'consultas'));

  /* linha do tempo: { idosoId, data, itens, anotacoes } */
  r.get('/:idosoId/dias/:data', async (req, res) => {
    res.json(await montarDia(repo, req.idoso.id, req.params.data));
  });

  /* registra um item do dia.
     corpo: { horarioPrevisto?, status?: 'feito' | 'recusou' | null, horarioAdiado?: 'HH:MM' | null, horarioRegistro? }
     horarioPrevisto só é obrigatório quando o item aparece mais de uma vez no dia (remédio de 8 em 8 h, por ex.) */
  r.patch('/:idosoId/dias/:data/itens/:itemId', async (req, res) => {
    const { data, itemId } = req.params;
    const corpo = req.body || {};
    const dia = await montarDia(repo, req.idoso.id, data);

    let candidatos = dia.itens.filter((i) => i.itemId === itemId);
    if (corpo.horarioPrevisto !== undefined) {
      candidatos = candidatos.filter((i) => i.horarioPrevisto === corpo.horarioPrevisto);
    }
    if (!candidatos.length) throw new ErroHttp(404, 'Item não está na agenda deste dia');
    if (candidatos.length > 1) throw new ErroHttp(400, 'Informe horarioPrevisto: o item aparece mais de uma vez no dia');
    const item = candidatos[0];

    const mudanca = {};
    if (corpo.status !== undefined) {
      if (corpo.status === null) {
        Object.assign(mudanca, { status: null, horarioRegistro: null, registradoPor: null });
      } else {
        const { statusRegistro } = await repo.buscarCatalogos();
        mudanca.status = validarOpcao(corpo.status, statusRegistro, 'Status');
        mudanca.horarioRegistro = corpo.horarioRegistro === undefined
          ? horaAgora()
          : validarHora(corpo.horarioRegistro, 'Horário do registro');
        mudanca.registradoPor = req.usuario.id;
      }
    }
    if (corpo.horarioAdiado !== undefined) {
      mudanca.horarioAdiado = corpo.horarioAdiado === null ? null : validarHora(corpo.horarioAdiado, 'Horário adiado');
    }
    if (!Object.keys(mudanca).length) throw new ErroHttp(400, 'Envie status e/ou horarioAdiado');

    const chave = { idosoId: req.idoso.id, data, tipo: item.tipo, itemId, horarioPrevisto: item.horarioPrevisto };
    const registro = await repo.salvarRegistro(chave, mudanca);

    /* registro que ficou sem status e sem adiamento não guarda mais nada */
    if (!registro.status && !registro.horarioAdiado) await repo.remover('registros', registro.id);

    const atualizado = (await montarDia(repo, req.idoso.id, data)).itens.find((i) => i.chave === item.chave);
    res.json(atualizado);
  });

  r.post('/:idosoId/dias/:data/anotacoes', exigirPapel(['cliente', 'cuidador']), async (req, res) => {
    const corpo = req.body || {};
    const nota = await repo.inserir('anotacoes', {
      idosoId: req.idoso.id,
      autorId: req.usuario.id,
      data: req.params.data,
      hora: validarHora(corpo.hora),
      texto: validarTexto(corpo.texto, 'Texto', 120),
    });
    res.status(201).json(nota);
  });

  r.delete('/:idosoId/dias/:data/anotacoes/:id', async (req, res) => {
    const nota = await repo.buscar('anotacoes', req.params.id);
    if (!nota || nota.idosoId !== req.idoso.id || nota.data !== req.params.data) {
      throw new ErroHttp(404, 'Anotação não encontrada');
    }
    if (nota.autorId !== req.usuario.id) throw new ErroHttp(403, 'Só quem escreveu pode apagar a anotação');
    await repo.remover('anotacoes', nota.id);
    res.status(204).end();
  });

  /* botão "Chamar ajuda": avisa o cliente responsável e os cuidadores do idoso */
  r.get('/:idosoId/chamados', async (req, res) => {
    const chamados = await repo.listar('chamadosAjuda', { idosoId: req.idoso.id });
    res.json(chamados.sort((a, b) => b.dataHora.localeCompare(a.dataHora)));
  });

  r.post('/:idosoId/chamados', async (req, res) => {
    const notificados = (await interessados(repo, req.idoso)).filter((id) => id !== req.usuario.id);
    const chamado = await repo.inserir('chamadosAjuda', {
      idosoId: req.idoso.id,
      abertoPor: req.usuario.id,
      dataHora: agora(),
      mensagem: validarTextoOpcional(req.body?.mensagem, 'Mensagem', 200),
      notificados,
      status: 'aberto',
    });
    res.status(201).json(chamado);
  });

  r.patch('/:idosoId/chamados/:id', async (req, res) => {
    const chamado = await repo.buscar('chamadosAjuda', req.params.id);
    if (!chamado || chamado.idosoId !== req.idoso.id) throw new ErroHttp(404, 'Chamado não encontrado');
    const { statusChamado } = await repo.buscarCatalogos();
    const status = validarOpcao(req.body?.status, statusChamado, 'Status');
    res.json(await repo.atualizar('chamadosAjuda', chamado.id, { status }));
  });

  return r;
}
