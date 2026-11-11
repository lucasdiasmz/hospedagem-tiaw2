const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function getFuso() {
  return process.env.FUSO_HORARIO || "-03:00";
}

function getOffsetMinutos() {
  const fuso = getFuso();
  let sinal = 1;
  if (fuso.charAt(0) === "-") {
    sinal = -1;
  }
  const partes = fuso.slice(1).split(":");
  return sinal * (Number(partes[0]) * 60 + Number(partes[1]));
}

export function dataNoFuso(data) {
  const local = new Date(data.getTime() + getOffsetMinutos() * 60000);
  return local.toISOString().slice(0, 10);
}

export function hojeNoFuso() {
  return dataNoFuso(new Date());
}

export function dataValida(texto) {
  if (typeof texto !== "string" || !DATA_REGEX.test(texto)) {
    return false;
  }

  const data = new Date(texto + "T00:00:00.000Z");
  if (isNaN(data.getTime())) {
    return false;
  } else {
    return data.toISOString().slice(0, 10) === texto;
  }
}

export function somarDias(texto, dias) {
  const data = new Date(texto + "T00:00:00.000Z");
  data.setUTCDate(data.getUTCDate() + dias);
  return data.toISOString().slice(0, 10);
}

export function inicioDoDia(texto) {
  return new Date(texto + "T00:00:00.000" + getFuso());
}

export function dataHoraNoFuso(texto, horario) {
  return new Date(texto + "T" + horario + ":00.000" + getFuso());
}
