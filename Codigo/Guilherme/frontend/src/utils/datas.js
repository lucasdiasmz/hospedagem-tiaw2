const FUSO = "America/Sao_Paulo";

export function hojeNoFuso() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

export function somarDias(texto, dias) {
  const data = new Date(texto + "T00:00:00.000Z");
  data.setUTCDate(data.getUTCDate() + dias);
  return data.toISOString().slice(0, 10);
}

export function formatarHora(iso) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: FUSO
  });
}

export function getHora(iso) {
  return Number(formatarHora(iso).slice(0, 2));
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function formatarDataLonga(texto) {
  const data = new Date(texto + "T12:00:00.000Z");
  return capitalizar(
    data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC"
    })
  );
}

export function formatarDataCurta(texto) {
  const partes = texto.split("-");
  return partes[2] + "/" + partes[1];
}

export function getRotuloDia(texto, hoje) {
  if (texto === hoje) {
    return "Hoje";
  } else if (texto === somarDias(hoje, -1)) {
    return "Ontem";
  } else {
    const data = new Date(texto + "T12:00:00.000Z");
    return capitalizar(data.toLocaleDateString("pt-BR", { weekday: "long", timeZone: "UTC" }));
  }
}
