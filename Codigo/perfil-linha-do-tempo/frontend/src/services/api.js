import { urlApi } from "@ds/navegacao.js";
import { pedir } from "@ds/sessao.js";

/* local: o Vite repassa /api para o backend; publicado: a API no Render (src/navegacao.js) */
const API_URL = urlApi("perfil") + "/api";

async function requisicao(caminho, opcoes) {
  let resposta = null;

  try {
    resposta = await pedir(API_URL + caminho, {
      headers: { "Content-Type": "application/json" },
      ...opcoes
    });
  } catch (erro) {
    throw new Error("Sem conexão com o servidor. Confira a internet e tente de novo.");
  }

  if (resposta.status === 204) {
    return null;
  }

  let dados = null;
  try {
    dados = await resposta.json();
  } catch (erro) {
    dados = null;
  }

  if (!resposta.ok) {
    if (dados && dados.mensagem) {
      throw new Error(dados.mensagem);
    } else if (resposta.status >= 500) {
      throw new Error("Sem conexão com o servidor. Confira a internet e tente de novo.");
    } else {
      throw new Error("Erro " + resposta.status + " ao falar com o servidor");
    }
  }

  return dados;
}

export function listarIdosos() {
  return requisicao("/idosos", { method: "GET" });
}

export function buscarIdoso(id) {
  return requisicao("/idosos/" + id, { method: "GET" });
}

export function atualizarIdoso(id, dados) {
  return requisicao("/idosos/" + id, {
    method: "PUT",
    body: JSON.stringify(dados)
  });
}

export function listarRelatos(idosoId, data) {
  return requisicao("/idosos/" + idosoId + "/relatos?data=" + data, { method: "GET" });
}

export function buscarResumoSemana(idosoId, data) {
  return requisicao("/idosos/" + idosoId + "/relatos/resumo-semana?data=" + data, { method: "GET" });
}

export function criarRelato(idosoId, dados) {
  return requisicao("/idosos/" + idosoId + "/relatos", {
    method: "POST",
    body: JSON.stringify(dados)
  });
}

export function marcarComoVisto(relatoId) {
  return requisicao("/relatos/" + relatoId + "/visto", { method: "PATCH" });
}
