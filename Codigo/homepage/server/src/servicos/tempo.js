import { DIAS_SEMANA } from '../validacao.js';

/* "AAAA-MM-DDTHH:MM:SS" no fuso local, mesmo formato das datas do db.json */
export function agora() {
  return new Date().toLocaleString('sv-SE').replace(' ', 'T');
}

export function horaAgora() {
  return agora().slice(11, 16);
}

/* "2026-10-27" → "ter" */
export function diaDaSemana(data) {
  return DIAS_SEMANA[new Date(data + 'T12:00:00Z').getUTCDay()];
}
