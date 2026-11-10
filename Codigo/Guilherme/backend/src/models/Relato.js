import mongoose from "mongoose";
import { TIPOS, NIVEIS, PAPEIS, precisaDeAtencao } from "../constants/relatos.js";

const { Schema } = mongoose;

function dataNaoFutura(valor) {
  if (!valor) {
    return false;
  } else {
    return valor.getTime() <= Date.now() + 5 * 60000;
  }
}

const relatoSchema = new Schema(
  {
    idoso: { type: Schema.Types.ObjectId, ref: "Idoso", required: [true, "Idoso é obrigatório"] },
    tipo: {
      type: String,
      required: [true, "Tipo do relato é obrigatório"],
      enum: { values: TIPOS, message: "Tipo de relato inválido" }
    },
    descricao: {
      type: String,
      trim: true,
      required: [true, "Descrição do relato é obrigatória"],
      maxlength: [500, "Descrição com no máximo 500 caracteres"]
    },
    dataHora: {
      type: Date,
      default: Date.now,
      validate: { validator: dataNaoFutura, message: "O relato não pode ter data no futuro" }
    },
    nivel: {
      type: String,
      default: "Normal",
      enum: { values: NIVEIS, message: "Nível inválido. Use Normal, Atencao ou Urgente" }
    },
    registradoPor: {
      nome: { type: String, trim: true, required: [true, "Nome de quem registrou é obrigatório"] },
      papel: {
        type: String,
        required: [true, "Papel de quem registrou é obrigatório"],
        enum: { values: PAPEIS, message: "Papel inválido. Use idoso, cuidador ou familiar" }
      }
    },
    visto: { type: Boolean, default: false },
    vistoEm: { type: Date, default: null }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        ret.idoso = ret.idoso.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

relatoSchema.virtual("precisaAtencao").get(function () {
  return precisaDeAtencao(this.nivel);
});

relatoSchema.index({ idoso: 1, dataHora: 1 });

const Relato = mongoose.model("Relato", relatoSchema);

export default Relato;
