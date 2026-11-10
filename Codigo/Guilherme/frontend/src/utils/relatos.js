import { PERIODOS, getNivel, getRotuloPapel } from "../data/relatos.js";
import { USUARIO_LOGADO } from "../data/usuario.js";
import { formatarHora, getHora, formatarDataLonga, getRotuloDia, formatarDataCurta } from "./datas.js";

export function nomeCurto(nome) {
  const partes = nome.trim().split(/\s+/);
  if (partes.length <= 2) {
    return partes.join(" ");
  } else {
    return partes[0] + " " + partes[partes.length - 1];
  }
}

export function ehUsuarioLogado(autor) {
  return autor.nome === USUARIO_LOGADO.nome;
}

export function getRotuloAutor(autor) {
  if (ehUsuarioLogado(autor)) {
    return "Você";
  } else {
    return nomeCurto(autor.nome);
  }
}

export function getMembros(relatos) {
  const membros = [];

  relatos.forEach(function (relato) {
    const jaExiste = membros.some(function (membro) {
      return membro.nome === relato.registradoPor.nome;
    });

    if (!jaExiste) {
      membros.push({
        nome: relato.registradoPor.nome,
        papel: getRotuloPapel(relato.registradoPor.papel),
        rotulo: getRotuloAutor(relato.registradoPor)
      });
    }
  });

  return membros.sort(function (a, b) {
    if (a.rotulo === "Você") {
      return -1;
    } else if (b.rotulo === "Você") {
      return 1;
    } else {
      return a.rotulo.localeCompare(b.rotulo);
    }
  });
}

export function agruparPorPeriodo(relatos) {
  const grupos = PERIODOS.map(function (periodo) {
    return {
      periodo: periodo,
      relatos: relatos.filter(function (relato) {
        const hora = getHora(relato.dataHora);
        return hora >= periodo.inicio && hora < periodo.fim;
      })
    };
  });

  return grupos.filter(function (grupo) {
    return grupo.relatos.length > 0;
  });
}

function linhaRelato(relato) {
  let linha = "• " + formatarHora(relato.dataHora) + " — " + relato.tipo + ": " + relato.descricao;
  linha = linha + " (" + nomeCurto(relato.registradoPor.nome) + ")";

  if (relato.nivel !== "Normal") {
    linha = linha + " [" + getNivel(relato.nivel).label.toUpperCase() + "]";
  }

  return linha;
}

function adicionarSecao(linhas, titulo, relatos, textoVazio) {
  linhas.push(titulo);
  if (relatos.length === 0) {
    linhas.push(textoVazio);
  } else {
    relatos.forEach(function (relato) {
      linhas.push(linhaRelato(relato));
    });
  }
  linhas.push("");
}

export function montarTextoPassagem({ idoso, data, hoje, relatos, resumo }) {
  const linhas = [];
  let nomeIdoso = nomeCurto(idoso.nome);
  if (idoso.apelido) {
    nomeIdoso = idoso.apelido;
  }

  linhas.push("PASSAGEM DE PLANTÃO — " + nomeIdoso);
  linhas.push(getRotuloDia(data, hoje) + ", " + formatarDataLonga(data).toLowerCase());
  linhas.push("Responsável: " + USUARIO_LOGADO.nome + " (" + USUARIO_LOGADO.papel + ")");
  linhas.push("");

  const urgentes = relatos.filter(function (relato) {
    return relato.nivel === "Urgente";
  });
  const atencao = relatos.filter(function (relato) {
    return relato.nivel === "Atencao";
  });

  adicionarSecao(linhas, "URGENTES", urgentes, "Nenhum relato urgente.");
  adicionarSecao(linhas, "PONTOS DE ATENÇÃO", atencao, "Nenhum ponto de atenção registrado.");

  linhas.push("LINHA DO TEMPO");
  if (relatos.length === 0) {
    linhas.push("Nenhum relato registrado neste dia.");
  } else {
    agruparPorPeriodo(relatos).forEach(function (grupo) {
      linhas.push(grupo.periodo.label);
      grupo.relatos.forEach(function (relato) {
        linhas.push(linhaRelato(relato));
      });
    });
  }

  if (resumo) {
    linhas.push("");
    linhas.push("ÚLTIMOS 7 DIAS (" + formatarDataCurta(resumo.inicio) + " a " + formatarDataCurta(resumo.fim) + ")");
    if (resumo.pontosAtencao.length === 0) {
      linhas.push("Semana sem pontos de atenção.");
    } else {
      resumo.pontosAtencao.forEach(function (ponto) {
        linhas.push("• " + ponto.texto);
      });
    }
  }

  return linhas.join("\n");
}
