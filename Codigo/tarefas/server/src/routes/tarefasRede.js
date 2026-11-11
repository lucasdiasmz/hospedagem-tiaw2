import { Router } from 'express';
import TarefaRede from '../models/TarefaRede.js';

const rotas = Router();

/* próximo id no formato do JSON: trd-1, trd-2... */
async function proximoId() {
  const todas = await TarefaRede.find({}, { id: 1, _id: 0 }).lean();
  const maior = todas.reduce((n, t) => Math.max(n, Number(t.id.replace('trd-', '')) || 0), 0);
  return 'trd-' + (maior + 1);
}

/* data e hora locais no formato do JSON: 2026-11-10T12:00:00 */
function agoraIso() {
  const local = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 19);
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
    const filtro = {};
    if (req.query.idosoId) filtro.idosoId = String(req.query.idosoId);
    if (req.query.status) filtro.status = String(req.query.status);
    res.json(await TarefaRede.find(filtro).sort({ prazo: 1 }));
  } catch (e) {
    next(e);
  }
});

/* POST /tarefas-rede  (toda tarefa nova começa em "a_fazer") */
rotas.post('/', async (req, res, next) => {
  try {
    const { id, _id, status, concluidoEm, ...dados } = req.body;
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

    const tarefa = await TarefaRede.findOne({ id: req.params.id });
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada.' });

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
