import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';

/* catálogos do JSON global, para validar categoria e status */
const { catalogos } = JSON.parse(
  readFileSync(new URL('../../../../db/db.json', import.meta.url), 'utf-8'),
);

/* data e hora no formato do JSON: 2026-11-10T12:00:00 */
const DATA_HORA = /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

const itemCompra = new mongoose.Schema(
  {
    nome: { type: String, required: [true, 'Informe o nome do item.'], trim: true, maxlength: 40 },
    preco: { type: Number, required: true, min: [0, 'O preço não pode ser negativo.'] },
    comprado: { type: Boolean, default: false },
  },
  { _id: false },
);

const lembretes = new mongoose.Schema(
  {
    avisarResponsavel: { type: Boolean, default: true },
    antecedenciaMinutos: { type: Number, default: 60, min: 0 },
    avisarRedeSeAtrasar: { type: Boolean, default: false },
  },
  { _id: false },
);

/* mesmo formato do db.json: o "id" (trd-1, trd-2...) é mantido para juntar os bancos depois */
const esquema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    idosoId: { type: String, required: true, index: true },
    titulo: { type: String, required: [true, 'Informe o título da tarefa.'], trim: true, maxlength: 60 },
    categoria: { type: String, required: true, enum: { values: catalogos.categoriasTarefaRede, message: 'Categoria inválida.' } },
    status: { type: String, default: 'a_fazer', enum: { values: catalogos.statusTarefaRede, message: 'Status inválido.' } },
    responsavelId: { type: String, required: [true, 'Escolha o responsável.'] },
    responsavelSugerido: { type: Boolean, default: false },
    prazo: { type: String, required: [true, 'Informe o prazo.'], match: [DATA_HORA, 'Prazo inválido.'] },
    observacoes: { type: String, default: '', trim: true, maxlength: 120 },
    lembretes: { type: lembretes, default: () => ({}) },
    itensCompra: { type: [itemCompra], default: [] },
    criadoPor: { type: String, required: true },
    criadoEm: { type: String, required: true },
    concluidoEm: { type: String, default: null },
  },
  {
    collection: 'tarefasRede',
    versionKey: false,
    /* a resposta sai igual ao JSON, sem o _id do MongoDB */
    toJSON: { transform: (_doc, ret) => { delete ret._id; return ret; } },
  },
);

export default mongoose.model('TarefaRede', esquema);
