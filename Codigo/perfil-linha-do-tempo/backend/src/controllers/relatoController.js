import mongoose from "mongoose";
import Idoso from "../models/Idoso.js";
import { podeVerPerfil } from "../services/acessoPerfil.js";
import Relato from "../models/Relato.js";
import { montarResumoSemana } from "../services/resumoSemana.js";
import { dataValida, hojeNoFuso, inicioDoDia, somarDias } from "../utils/datas.js";

const PAPEL_NO_RELATO = { cliente: "familiar", cuidador: "cuidador", idoso: "idoso" };

/* o relato precisa ser de um idoso da pessoa (fica em req.relato) */
export async function carregarRelato(req, res, next, id) {
  try {
    const relato = mongoose.Types.ObjectId.isValid(id) ? await Relato.findById(id) : null;
    const idoso = relato && (await Idoso.findById(relato.idoso));
    if (!(await podeVerPerfil(req.usuario, idoso))) {
      return res.status(404).json({ mensagem: "Relato não encontrado" });
    }
    req.relato = relato;
    return next();
  } catch (erro) {
    return next(erro);
  }
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

function limparCorpo(body) {
  const dados = { ...body };
  delete dados.id;
  delete dados._id;
  delete dados.idoso;
  delete dados.registradoPor;
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

    if (data === null) {
      return res.status(400).json({ mensagem: "Data inválida. Use o formato AAAA-MM-DD" });
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

    if (data === null) {
      return res.status(400).json({ mensagem: "Data inválida. Use o formato AAAA-MM-DD" });
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
    /* quem registrou vem da sessão, não do corpo */
    const relato = await Relato.create({
      ...limparCorpo(req.body),
      idoso: req.idoso._id,
      registradoPor: { nome: req.usuario.nome, papel: PAPEL_NO_RELATO[req.papel] }
    });
    return res.status(201).json(relato);
  } catch (erro) {
    return next(erro);
  }
}

export async function marcarComoVisto(req, res, next) {
  try {
    req.relato.visto = true;
    req.relato.vistoEm = new Date();
    await req.relato.save();
    return res.json(req.relato);
  } catch (erro) {
    return next(erro);
  }
}

export async function removerRelato(req, res, next) {
  try {
    await req.relato.deleteOne();
    return res.status(204).send();
  } catch (erro) {
    return next(erro);
  }
}
