import mongoose from "mongoose";
import Idoso from "../models/Idoso.js";
import Relato from "../models/Relato.js";
import { montarResumoSemana } from "../services/resumoSemana.js";
import { dataValida, hojeNoFuso, inicioDoDia, somarDias } from "../utils/datas.js";

function idValido(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function lerData(req) {
  const data = req.query.data;
  if (data === undefined || data === "") {
    return hojeNoFuso();
  } else if (dataValida(data)) {
    return data;
  } else {
    return null;
  }
}

async function idosoExiste(id) {
  const total = await Idoso.countDocuments({ _id: id });
  return total > 0;
}

function limparCorpo(body) {
  const dados = { ...body };
  delete dados.id;
  delete dados._id;
  delete dados.idoso;
  delete dados.visto;
  delete dados.vistoEm;
  delete dados.createdAt;
  delete dados.updatedAt;
  return dados;
}

export async function listarRelatosDoIdoso(req, res, next) {
  try {
    const { id } = req.params;
    const data = lerData(req);

    if (!idValido(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }
    if (data === null) {
      return res.status(400).json({ mensagem: "Data inválida. Use o formato AAAA-MM-DD" });
    }
    if (!(await idosoExiste(id))) {
      return res.status(404).json({ mensagem: "Idoso não encontrado" });
    }

    const relatos = await Relato.find({
      idoso: id,
      dataHora: { $gte: inicioDoDia(data), $lt: inicioDoDia(somarDias(data, 1)) }
    }).sort({ dataHora: 1 });

    return res.json({ data: data, relatos: relatos });
  } catch (erro) {
    next(erro);
  }
}

export async function resumoDaSemana(req, res, next) {
  try {
    const { id } = req.params;
    const data = lerData(req);

    if (!idValido(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }
    if (data === null) {
      return res.status(400).json({ mensagem: "Data inválida. Use o formato AAAA-MM-DD" });
    }
    if (!(await idosoExiste(id))) {
      return res.status(404).json({ mensagem: "Idoso não encontrado" });
    }

    const inicio = somarDias(data, -6);
    const relatos = await Relato.find({
      idoso: id,
      dataHora: { $gte: inicioDoDia(inicio), $lt: inicioDoDia(somarDias(data, 1)) }
    });

    return res.json(montarResumoSemana(relatos, inicio, data));
  } catch (erro) {
    next(erro);
  }
}

export async function criarRelato(req, res, next) {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }
    if (!(await idosoExiste(id))) {
      return res.status(404).json({ mensagem: "Idoso não encontrado" });
    }

    const relato = await Relato.create({ ...limparCorpo(req.body), idoso: id });
    return res.status(201).json(relato);
  } catch (erro) {
    next(erro);
  }
}

export async function marcarComoVisto(req, res, next) {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const relato = await Relato.findByIdAndUpdate(
      id,
      { visto: true, vistoEm: new Date() },
      { new: true }
    );

    if (!relato) {
      return res.status(404).json({ mensagem: "Relato não encontrado" });
    } else {
      return res.json(relato);
    }
  } catch (erro) {
    next(erro);
  }
}

export async function removerRelato(req, res, next) {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const relato = await Relato.findByIdAndDelete(id);

    if (!relato) {
      return res.status(404).json({ mensagem: "Relato não encontrado" });
    } else {
      return res.status(204).send();
    }
  } catch (erro) {
    next(erro);
  }
}
