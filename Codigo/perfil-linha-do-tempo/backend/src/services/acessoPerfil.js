import mongoose from "mongoose";
import { idososDoUsuario } from "../../../../auth/acesso.js";
import { repoMongo } from "../../../../auth/repos.js";
import Idoso from "../models/Idoso.js";

/* usuários, vínculos, remédios e idosos ficam no banco principal, no mesmo cluster do perfil */
export const repo = repoMongo(function () {
  return mongoose.connection.useDb(process.env.MONGODB_DB_PRINCIPAL || "acessamob", { useCache: true }).db;
});

/* Os idosos do db.json têm id curto (ido-1). Só eles podem assumir um perfil antigo, ainda sem ligação:
   ids de novos cadastros são aleatórios, então ninguém toma o perfil de outra pessoa repetindo o nome. */
const ID_DO_SEED = /^ido-\d{1,3}$/;

/* perfil do idoso do banco principal: o já ligado, o antigo do seed, ou um novo */
async function acharOuCriar(idoso) {
  const ligado = await Idoso.findOne({ idosoId: idoso.id });
  if (ligado) {
    return ligado;
  }

  const nascimento = new Date(idoso.dataNascimento);
  const antigo = ID_DO_SEED.test(idoso.id) && (await Idoso.findOneAndUpdate(
    { idosoId: { $exists: false }, nome: idoso.nome, dataNascimento: nascimento },
    { idosoId: idoso.id },
    { new: true }
  ));
  if (antigo) {
    return antigo;
  }

  try {
    return await Idoso.create({
      idosoId: idoso.id,
      nome: idoso.nome,
      apelido: idoso.apelido,
      dataNascimento: nascimento,
      sexo: idoso.sexo,
      tipoSanguineo: idoso.tipoSanguineo,
      telefone: idoso.telefone,
      endereco: idoso.endereco,
      planoSaude: idoso.planoSaude,
      mobilidade: {
        nivel: idoso.mobilidade?.nivel || "Independente",
        descricao: idoso.mobilidade?.descricao,
        equipamentos: idoso.mobilidade?.equipamentos,
        precisaAjudaPara: idoso.mobilidade?.precisaAjudaPara
      },
      condicoes: idoso.condicoes,
      alergias: idoso.alergias,
      contatos: idoso.contatos,
      sobre: idoso.sobre,
      observacoes: idoso.observacoes
    });
  } catch (erro) {
    /* duas telas abertas ao mesmo tempo: a outra já criou */
    if (erro.code === 11000) {
      return Idoso.findOne({ idosoId: idoso.id });
    }
    throw erro;
  }
}

/* remédios e equipe vêm do banco principal, para não divergir das outras telas */
export async function completar(perfil) {
  const [remedios, vinculos] = await Promise.all([
    repo.listar("medicamentos", { idosoId: perfil.idosoId, ativo: true }),
    repo.listar("vinculos", { idosoId: perfil.idosoId, ativo: true })
  ]);

  const medicamentos = remedios
    .flatMap(function (m) {
      return m.horarios.map(function (horario) {
        return { nome: m.nome, dose: m.dosagem, horario: horario };
      });
    })
    .sort(function (a, b) {
      return a.horario.localeCompare(b.horario);
    });

  const cuidadores = [];
  for (const vinculo of vinculos) {
    const cuidador = vinculo.cuidadorId && (await repo.buscar("cuidadores", vinculo.cuidadorId));
    const usuario = cuidador && (await repo.buscar("usuarios", cuidador.usuarioId));
    if (usuario) {
      cuidadores.push({ nome: usuario.nome, funcao: vinculo.funcao || "", turno: vinculo.turno || "" });
    }
  }

  return { ...perfil.toJSON(), medicamentos: medicamentos, cuidadores: cuidadores };
}

export async function perfisDoUsuario(usuario) {
  const idosos = await idososDoUsuario(repo, usuario);
  return Promise.all(idosos.map(acharOuCriar));
}

export async function podeVerPerfil(usuario, perfil) {
  if (!perfil || !perfil.idosoId) {
    return false;
  }
  const idosos = await idososDoUsuario(repo, usuario);
  return idosos.some(function (idoso) {
    return idoso.id === perfil.idosoId;
  });
}
