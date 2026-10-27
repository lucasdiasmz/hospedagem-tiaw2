import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';

/* catálogos do JSON global, para validar forma e via */
const { catalogos } = JSON.parse(
  readFileSync(new URL('../../../db/db.json', import.meta.url), 'utf-8'),
);

const HORARIO = /^([01]\d|2[0-3]):[0-5]\d$/;

/* mesmo formato do db.json: o "id" (med-1, med-2...) é mantido para juntar os bancos depois */
const esquema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    idosoId: { type: String, required: true, index: true },
    nome: { type: String, required: true, trim: true, maxlength: 60 },
    dosagem: { type: String, required: true, trim: true, maxlength: 30 },
    forma: { type: String, required: true, enum: catalogos.formasMedicamento },
    via: { type: String, required: true, enum: catalogos.viasMedicamento },
    frequencia: { type: Number, required: true, min: 1 },
    horarios: {
      type: [String],
      validate: {
        validator: (h) => h.length > 0 && h.every((x) => HORARIO.test(x)) && new Set(h).size === h.length,
        message: 'Informe horários válidos (HH:MM) e sem repetição.',
      },
    },
    categoria: { type: String, default: '', trim: true, maxlength: 40 },
    observacoes: { type: String, default: '', trim: true, maxlength: 120 },
    ativo: { type: Boolean, default: true },
    cadastradoPor: { type: String, required: true },
    criadoEm: { type: String, required: true },
  },
  {
    collection: 'medicamentos',
    versionKey: false,
    /* a resposta sai igual ao JSON, sem o _id do MongoDB */
    toJSON: { transform: (_doc, ret) => { delete ret._id; return ret; } },
  },
);

export default mongoose.model('Medicamento', esquema);
