import { Router } from 'express';
import Medicamento from '../models/Medicamento.js';

const rotas = Router();

/* próximo id no formato do JSON: med-1, med-2... */
async function proximoId() {
  const todos = await Medicamento.find({}, { id: 1, _id: 0 }).lean();
  const maior = todos.reduce((n, m) => Math.max(n, Number(m.id.replace('med-', '')) || 0), 0);
  return 'med-' + (maior + 1);
}

function erroDeValidacao(e, res, next) {
  if (e.name === 'ValidationError') {
    const mensagens = Object.values(e.errors).map((x) => x.message);
    return res.status(400).json({ erro: mensagens.join(' ') });
  }
  return next(e);
}

/* GET /medicamentos?idosoId=ido-1 */
rotas.get('/', async (req, res, next) => {
  try {
    const filtro = req.query.idosoId ? { idosoId: String(req.query.idosoId) } : {};
    res.json(await Medicamento.find(filtro).sort({ criadoEm: 1 }));
  } catch (e) {
    next(e);
  }
});

/* POST /medicamentos */
rotas.post('/', async (req, res, next) => {
  try {
    const { id, _id, ...dados } = req.body;
    const criado = await Medicamento.create({ ...dados, id: await proximoId() });
    res.status(201).json(criado);
  } catch (e) {
    erroDeValidacao(e, res, next);
  }
});

/* PATCH /medicamentos/:id  { "ativo": true|false } */
rotas.patch('/:id', async (req, res, next) => {
  try {
    if (typeof req.body.ativo !== 'boolean') {
      return res.status(400).json({ erro: 'Informe "ativo" como true ou false.' });
    }
    const med = await Medicamento.findOneAndUpdate(
      { id: req.params.id },
      { ativo: req.body.ativo },
      { new: true },
    );
    if (!med) return res.status(404).json({ erro: 'Medicamento não encontrado.' });
    res.json(med);
  } catch (e) {
    next(e);
  }
});

export default rotas;
