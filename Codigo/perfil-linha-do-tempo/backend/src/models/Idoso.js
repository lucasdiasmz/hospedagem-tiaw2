import mongoose from "mongoose";

const { Schema } = mongoose;

const HORARIO_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const medicamentoSchema = new Schema(
  {
    nome: { type: String, required: [true, "Nome do medicamento é obrigatório"], trim: true },
    dose: { type: String, trim: true, default: "" },
    horario: { type: String, required: true, match: [HORARIO_REGEX, "Horário deve estar no formato HH:MM"] }
  },
  { _id: false }
);

const rotinaSchema = new Schema(
  {
    horario: { type: String, required: true, match: [HORARIO_REGEX, "Horário deve estar no formato HH:MM"] },
    atividade: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const contatoSchema = new Schema(
  {
    nome: { type: String, required: true, trim: true },
    parentesco: { type: String, trim: true, default: "" },
    telefone: { type: String, required: true, trim: true },
    principal: { type: Boolean, default: false }
  },
  { _id: false }
);

const cuidadorSchema = new Schema(
  {
    nome: { type: String, required: true, trim: true },
    funcao: { type: String, trim: true, default: "" },
    turno: { type: String, trim: true, default: "" }
  },
  { _id: false }
);

const mobilidadeSchema = new Schema(
  {
    nivel: {
      type: String,
      enum: { values: ["Independente", "Parcial", "Dependente"], message: "Nível de mobilidade inválido" },
      required: true
    },
    descricao: { type: String, trim: true, default: "" },
    equipamentos: { type: [String], default: [] },
    precisaAjudaPara: { type: [String], default: [] }
  },
  { _id: false }
);

function dataNaoFutura(valor) {
  if (!valor) {
    return false;
  } else {
    return valor <= new Date();
  }
}

const idosoSchema = new Schema(
  {
    /* id no banco principal (ido-1); é por ele que se confere quem pode ver este perfil */
    idosoId: { type: String, unique: true, sparse: true },
    nome: { type: String, required: [true, "Nome é obrigatório"], trim: true },
    apelido: { type: String, trim: true, default: "" },
    dataNascimento: {
      type: Date,
      required: [true, "Data de nascimento é obrigatória"],
      validate: { validator: dataNaoFutura, message: "A data de nascimento não pode ser no futuro" }
    },
    sexo: { type: String, enum: ["", "Masculino", "Feminino", "Outro"], default: "" },
    tipoSanguineo: {
      type: String,
      enum: { values: ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], message: "Tipo sanguíneo inválido" },
      /* vazio = não informado; um padrão aqui seria um dado de saúde inventado */
      default: ""
    },
    telefone: { type: String, trim: true, default: "" },
    endereco: { type: String, trim: true, default: "" },
    planoSaude: { type: String, trim: true, default: "" },
    mobilidade: { type: mobilidadeSchema, required: true },
    condicoes: { type: [String], default: [] },
    alergias: { type: [String], default: [] },
    medicamentos: { type: [medicamentoSchema], default: [] },
    rotina: { type: [rotinaSchema], default: [] },
    contatos: { type: [contatoSchema], default: [] },
    cuidadores: { type: [cuidadorSchema], default: [] },
    sobre: { type: String, trim: true, default: "" },
    observacoes: { type: String, trim: true, default: "" }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        if (ret.dataNascimento) {
          ret.dataNascimento = ret.dataNascimento.toISOString().slice(0, 10);
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Idoso = mongoose.model("Idoso", idosoSchema);

export default Idoso;
