import mongoose from "mongoose";
import Idoso from "../models/Idoso.js";
import Relato from "../models/Relato.js";

function limparCorpo(body) {
  const dados = { ...body };
  delete dados.id;
  delete dados._id;
  delete dados.createdAt;
  delete dados.updatedAt;
  return dados;
}

function idValido(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function listarIdosos(req, res, next) {
  try {
    const idosos = await Idoso.find().sort({ nome: 1 });
    res.json(idosos);
  } catch (erro) {
    next(erro);
  }
}

export async function buscarIdoso(req, res, next) {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const idoso = await Idoso.findById(id);

    if (!idoso) {
      return res.status(404).json({ mensagem: "Idoso não encontrado" });
    } else {
      return res.json(idoso);
    }
  } catch (erro) {
    next(erro);
  }
}

export async function criarIdoso(req, res, next) {
  try {
    const idoso = await Idoso.create(limparCorpo(req.body));
    res.status(201).json(idoso);
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarIdoso(req, res, next) {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const idoso = await Idoso.findByIdAndUpdate(id, limparCorpo(req.body), {
      new: true,
      runValidators: true
    });

    if (!idoso) {
      return res.status(404).json({ mensagem: "Idoso não encontrado" });
    } else {
      return res.json(idoso);
    }
  } catch (erro) {
    next(erro);
  }
}

export async function removerIdoso(req, res, next) {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const idoso = await Idoso.findByIdAndDelete(id);

    if (!idoso) {
      return res.status(404).json({ mensagem: "Idoso não encontrado" });
    } else {
      await Relato.deleteMany({ idoso: id });
      return res.status(204).send();
    }
  } catch (erro) {
    next(erro);
  }
}
