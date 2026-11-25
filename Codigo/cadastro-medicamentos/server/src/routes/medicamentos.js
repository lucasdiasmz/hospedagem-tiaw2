import { Router } from 'express';
import { idososDoUsuario, temAcesso } from '../../../../auth/acesso.js';
import { MSG_SEM_ACESSO, exigirPapel } from '../../../../auth/express.js';
import { repo } from '../repo.js';
import Medicamento from '../models/Medicamento.js';

const rotas = Router();

/* só o familiar responsável cadastra e edita remédios */
const soFamiliar = exigirPapel(['cliente']);

function agoraIso() {
  return new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T');
}

/* o medicamento da URL, se for de um idoso da pessoa; senão responde 404 e devolve null */
async function doUsuario(req, res) {
  const med = await Medicamento.findOne({ id: String(req.params.id) }).lean();
  if (med && await temAcesso(repo, req.usuario, med.idosoId)) return med;
  res.status(404).json({ erro: 'Medicamento não encontrado.' });
  return null;
}

/* próximo id no formato do JSON: med-1, med-2... */
async function proximoId() {
  const todos = await Medicamento.find({}, { id: 1, _id: 1 }).lean();
  /* documentos criados pelo seed do início têm o id só no _id: considera os dois */
  const maior = todos.reduce((n, m) => Math.max(n, Number(String(m.id ?? m._id).replace('med-', '')) || 0), 0);
  return 'med-' + (maior + 1);
}

function erroDeValidacao(e, res, next) {
  if (e.name === 'ValidationError') {
    const mensagens = Object.values(e.errors).map((x) => x.message);
    return res.status(400).json({ erro: mensagens.join(' ') });
  }
  return next(e);
}

const EDITAVEIS = ['nome', 'dosagem', 'forma', 'via', 'frequencia', 'horarios', 'categoria', 'observacoes'];

/* GET /medicamentos?idosoId=ido-1 (sem idosoId: os de todos os idosos da pessoa) */
rotas.get('/', async (req, res, next) => {
  try {
    const permitidos = (await idososDoUsuario(repo, req.usuario)).map((i) => i.id);
    const pedido = req.query.idosoId && String(req.query.idosoId);
    if (pedido && !permitidos.includes(pedido)) return res.status(403).json({ erro: MSG_SEM_ACESSO });
    res.json(await Medicamento.find({ idosoId: { $in: pedido ? [pedido] : permitidos } }).sort({ criadoEm: 1 }));
  } catch (e) {
    next(e);
  }
});

/* POST /medicamentos */
rotas.post('/', soFamiliar, async (req, res, next) => {
  try {
    const { idosoId } = req.body;
    if (!(await temAcesso(repo, req.usuario, idosoId))) return res.status(403).json({ erro: MSG_SEM_ACESSO });
    const dados = Object.fromEntries(EDITAVEIS.filter((c) => c in req.body).map((c) => [c, req.body[c]]));
    const criado = await Medicamento.create({
      ...dados, idosoId, id: await proximoId(), ativo: true, cadastradoPor: req.usuario.id, criadoEm: agoraIso(),
    });
    res.status(201).json(criado);
  } catch (e) {
    erroDeValidacao(e, res, next);
  }
});

/* PATCH /medicamentos/:id  { "ativo": true|false } */
rotas.patch('/:id', soFamiliar, async (req, res, next) => {
  try {
    if (typeof req.body.ativo !== 'boolean') {
      return res.status(400).json({ erro: 'Informe "ativo" como true ou false.' });
    }
    const med = await doUsuario(req, res);
    if (!med) return;
    res.json(await Medicamento.findOneAndUpdate({ id: med.id }, { ativo: req.body.ativo }, { new: true }));
  } catch (e) {
    next(e);
  }
});

/* PUT /medicamentos/:id — edita os dados do medicamento (nome, dosagem, horários...) */
rotas.put('/:id', soFamiliar, async (req, res, next) => {
  try {
    const mudanca = Object.fromEntries(EDITAVEIS.filter((c) => c in req.body).map((c) => [c, req.body[c]]));
    const med = await doUsuario(req, res);
    if (!med) return;
    res.json(await Medicamento.findOneAndUpdate({ id: med.id }, mudanca, { new: true, runValidators: true }));
  } catch (e) {
    erroDeValidacao(e, res, next);
  }
});

export default rotas;
