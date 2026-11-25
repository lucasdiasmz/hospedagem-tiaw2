import { Router } from 'express';
import { idososDoUsuario, membrosDaRede, temAcesso } from '../../../../auth/acesso.js';
import { MSG_SEM_ACESSO, MSG_SEM_PERMISSAO, exigirPapel } from '../../../../auth/express.js';
import { repo } from '../repo.js';
import TarefaRede from '../models/TarefaRede.js';

const rotas = Router();

/* o idoso não usa esta tela */
rotas.use(exigirPapel(['cliente', 'cuidador']));

/* próximo id no formato do JSON: trd-1, trd-2... */
async function proximoId() {
  const todas = await TarefaRede.find({}, { id: 1, _id: 0 }).lean();
  const maior = todas.reduce((n, t) => Math.max(n, Number(t.id.replace('trd-', '')) || 0), 0);
  return 'trd-' + (maior + 1);
}

/* data e hora locais no formato do JSON: 2026-11-10T12:00:00 */
function agoraIso() {
  return new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T');
}

function erroDeValidacao(e, res, next) {
  if (e.name === 'ValidationError') {
    const mensagens = Object.values(e.errors).map((x) => x.message);
    return res.status(400).json({ erro: mensagens.join(' ') });
  }
  return next(e);
}

/* GET /tarefas-rede?idosoId=ido-1&status=a_fazer */
rotas.get('/', async (req, res, next) => {
  try {
    const permitidos = (await idososDoUsuario(repo, req.usuario)).map((i) => i.id);
    const pedido = req.query.idosoId && String(req.query.idosoId);
    if (pedido && !permitidos.includes(pedido)) return res.status(403).json({ erro: MSG_SEM_ACESSO });
    const filtro = { idosoId: { $in: pedido ? [pedido] : permitidos } };
    if (req.query.status) filtro.status = String(req.query.status);
    res.json(await TarefaRede.find(filtro).sort({ prazo: 1 }));
  } catch (e) {
    next(e);
  }
});

/* POST /tarefas-rede  (toda tarefa nova começa em "a_fazer") */
rotas.post('/', exigirPapel(['cliente']), async (req, res, next) => {
  try {
    const { id, _id, status, concluidoEm, ...dados } = req.body;
    if (!(await temAcesso(repo, req.usuario, dados.idosoId))) return res.status(403).json({ erro: MSG_SEM_ACESSO });
    const rede = await membrosDaRede(repo, await repo.buscar('idosos', dados.idosoId));
    if (!rede.some((m) => m.id === dados.responsavelId)) return res.status(400).json({ erro: 'Escolha alguém da rede de apoio.' });
    dados.criadoPor = req.usuario.id;
    dados.criadoEm = agoraIso();
    if (dados.categoria !== 'Compra') dados.itensCompra = [];
    const criada = await TarefaRede.create({ ...dados, id: await proximoId(), status: 'a_fazer', concluidoEm: null });
    res.status(201).json(criada);
  } catch (e) {
    erroDeValidacao(e, res, next);
  }
});

/*
  PATCH /tarefas-rede/:id
  { "status": "em_andamento" }          muda de aba
  { "itensComprados": [0, 2] }          marca itens da lista de compras como comprados
  Quando todos os itens de uma compra ficam comprados, a tarefa é concluída sozinha.
*/
rotas.patch('/:id', async (req, res, next) => {
  try {
    const { status, itensComprados } = req.body;
    if (status === undefined && itensComprados === undefined) {
      return res.status(400).json({ erro: 'Informe "status" ou "itensComprados".' });
    }

    const tarefa = await TarefaRede.findOne({ id: String(req.params.id) });
    if (!tarefa || !(await temAcesso(repo, req.usuario, tarefa.idosoId))) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    if (req.papel === 'cuidador' && tarefa.responsavelId !== req.usuario.id) return res.status(403).json({ erro: MSG_SEM_PERMISSAO });

    if (itensComprados !== undefined) {
      if (!Array.isArray(itensComprados)) {
        return res.status(400).json({ erro: '"itensComprados" deve ser uma lista de posições.' });
      }
      itensComprados.forEach((i) => {
        if (tarefa.itensCompra[i]) tarefa.itensCompra[i].comprado = true;
      });
      const tudoComprado = tarefa.itensCompra.length > 0 && tarefa.itensCompra.every((x) => x.comprado);
      if (tudoComprado) tarefa.status = 'concluido';
    }

    if (status !== undefined) tarefa.status = status;

    if (tarefa.status === 'concluido') {
      if (!tarefa.concluidoEm) tarefa.concluidoEm = agoraIso();
    } else {
      tarefa.concluidoEm = null;
    }

    await tarefa.save();
    res.json(tarefa);
  } catch (e) {
    erroDeValidacao(e, res, next);
  }
});

export default rotas;
