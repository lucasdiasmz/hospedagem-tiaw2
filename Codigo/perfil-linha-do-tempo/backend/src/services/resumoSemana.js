import { TIPOS } from "../constants/relatos.js";
import { dataNoFuso } from "../utils/datas.js";

function montarTexto(tipo, quantidade, urgentes) {
  let texto = tipo + ": " + quantidade + " alertas";
  if (quantidade === 1) {
    texto = tipo + ": 1 alerta";
  }

  if (urgentes === 1) {
    texto = texto + " (1 urgente)";
  } else if (urgentes > 1) {
    texto = texto + " (" + urgentes + " urgentes)";
  }

  return texto;
}

export function montarResumoSemana(relatos, inicio, fim) {
  const contagem = {};
  const dias = new Set();
  let totalUrgentes = 0;

  relatos.forEach(function (relato) {
    dias.add(dataNoFuso(relato.dataHora));

    if (relato.nivel !== "Normal") {
      if (!contagem[relato.tipo]) {
        contagem[relato.tipo] = { quantidade: 0, urgentes: 0 };
      }
      contagem[relato.tipo].quantidade = contagem[relato.tipo].quantidade + 1;

      if (relato.nivel === "Urgente") {
        contagem[relato.tipo].urgentes = contagem[relato.tipo].urgentes + 1;
        totalUrgentes = totalUrgentes + 1;
      }
    }
  });

  const pontosAtencao = Object.keys(contagem)
    .map(function (tipo) {
      return {
        tipo: tipo,
        quantidade: contagem[tipo].quantidade,
        urgentes: contagem[tipo].urgentes,
        texto: montarTexto(tipo, contagem[tipo].quantidade, contagem[tipo].urgentes)
      };
    })
    .sort(function (a, b) {
      if (b.urgentes !== a.urgentes) {
        return b.urgentes - a.urgentes;
      } else if (b.quantidade !== a.quantidade) {
        return b.quantidade - a.quantidade;
      } else {
        return TIPOS.indexOf(a.tipo) - TIPOS.indexOf(b.tipo);
      }
    })
    .slice(0, 5);

  return {
    inicio: inicio,
    fim: fim,
    totalRelatos: relatos.length,
    totalUrgentes: totalUrgentes,
    diasComRelato: dias.size,
    pontosAtencao: pontosAtencao
  };
}
