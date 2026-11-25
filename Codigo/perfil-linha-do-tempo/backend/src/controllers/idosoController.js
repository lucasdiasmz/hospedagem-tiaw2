import mongoose from "mongoose";
import Idoso from "../models/Idoso.js";
import { completar, perfisDoUsuario, podeVerPerfil } from "../services/acessoPerfil.js";

const EDITAVEIS = [
  "nome", "apelido", "dataNascimento", "sexo", "tipoSanguineo", "telefone", "endereco", "planoSaude",
  "mobilidade", "condicoes", "alergias", "rotina", "contatos", "sobre", "observacoes"
];

/* idoso de outra família responde 404, como se não existisse */
export async function carregarIdoso(req, res, next, id) {
  try {
    const idoso = mongoose.Types.ObjectId.isValid(id) ? await Idoso.findById(id) : null;
    if (!(await podeVerPerfil(req.usuario, idoso))) {
      return res.status(404).json({ mensagem: "Idoso não encontrado" });
    }
    req.idoso = idoso;
    return next();
  } catch (erro) {
    return next(erro);
  }
}

export async function listarIdosos(req, res, next) {
  try {
    const perfis = await perfisDoUsuario(req.usuario);
    const completos = await Promise.all(perfis.map(completar));
    completos.sort(function (a, b) {
      return a.nome.localeCompare(b.nome);
    });
    res.json(completos);
  } catch (erro) {
    next(erro);
  }
}

export async function buscarIdoso(req, res, next) {
  try {
    res.json(await completar(req.idoso));
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarIdoso(req, res, next) {
  try {
    EDITAVEIS.forEach(function (campo) {
      if (req.body[campo] !== undefined) {
        req.idoso.set(campo, req.body[campo]);
      }
    });
    await req.idoso.save();
    res.json(await completar(req.idoso));
  } catch (erro) {
    next(erro);
  }
}
