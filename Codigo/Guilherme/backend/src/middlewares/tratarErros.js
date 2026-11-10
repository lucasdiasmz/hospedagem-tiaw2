import mongoose from "mongoose";

export function rotaNaoEncontrada(req, res) {
  res.status(404).json({ mensagem: "Rota não encontrada: " + req.method + " " + req.originalUrl });
}

export function tratarErros(erro, req, res, next) {
  if (erro instanceof mongoose.Error.ValidationError) {
    const detalhes = Object.values(erro.errors).map(function (item) {
      return item.message;
    });
    return res.status(400).json({ mensagem: detalhes[0], detalhes: detalhes });
  } else if (erro instanceof mongoose.Error.CastError) {
    return res.status(400).json({ mensagem: "Valor inválido para o campo " + erro.path });
  } else if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ mensagem: "JSON inválido no corpo da requisição" });
  } else {
    console.error(erro);
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}
