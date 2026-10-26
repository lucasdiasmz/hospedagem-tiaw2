export function pad(n) {
  return String(n).padStart(2, '0');
}

export function horaAgora() {
  const d = new Date();
  return pad(d.getHours()) + ':' + pad(d.getMinutes());
}

/* AAAA-MM-DD, no fuso local */
export function diaDeHoje() {
  return new Date().toLocaleDateString('sv-SE');
}

export function somarMinutos(hora, min) {
  const [h, m] = hora.split(':').map(Number);
  const total = Math.min(h * 60 + m + min, 23 * 60 + 59);
  return pad(Math.floor(total / 60)) + ':' + pad(total % 60);
}

/* minutos de agora até "HH:MM" (negativo se já passou) */
export function minutosAte(hora) {
  const [h, m] = hora.split(':').map(Number);
  const d = new Date();
  return h * 60 + m - (d.getHours() * 60 + d.getMinutes());
}

/* 30 → "30 minutos", 60 → "1 hora", 135 → "2h15" */
export function duracaoPorExtenso(min) {
  if (min < 60) return min === 1 ? '1 minuto' : min + ' minutos';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (m) return h + 'h' + pad(m);
  return h === 1 ? '1 hora' : h + ' horas';
}

export function compararHora(a, b) {
  return a.hora < b.hora ? -1 : a.hora > b.hora ? 1 : 0;
}
