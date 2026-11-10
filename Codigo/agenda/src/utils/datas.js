/* datas no formato do banco: "AAAA-MM-DD" (dia) e "AAAA-MM" (mês), sempre no fuso local */

export const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
const NOMES_DIA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const NOMES_DIA_CURTO = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto',
  'setembro', 'outubro', 'novembro', 'dezembro'];

export function pad(n) {
  return String(n).padStart(2, '0');
}

export function hoje() {
  return new Date().toLocaleDateString('sv-SE');
}

export function horaAgora() {
  const d = new Date();
  return pad(d.getHours()) + ':' + pad(d.getMinutes());
}

/* meio-dia UTC: evita que o fuso mude o dia */
function paraDate(data) {
  return new Date(data + 'T12:00:00Z');
}

export function somarDias(data, n) {
  const d = paraDate(data);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/* "2026-10" + 1 → "2026-11" */
export function somarMeses(mes, n) {
  const [a, m] = mes.split('-').map(Number);
  const d = new Date(Date.UTC(a, m - 1 + n, 1));
  return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1);
}

export function diaDaSemana(data) {
  return paraDate(data).getUTCDay();
}

const partes = (data) => data.split('-').map(Number);

/* "Domingo, 8 de novembro de 2026" */
export function dataPorExtenso(data, { comAno = true } = {}) {
  const [a, m, d] = partes(data);
  return `${NOMES_DIA[diaDaSemana(data)]}, ${d} de ${MESES[m - 1]}` + (comAno ? ` de ${a}` : '');
}

/* "Domingo, 8 de novembro" sem "-feira", para títulos curtos */
export function dataCurta(data) {
  return dataPorExtenso(data, { comAno: false }).replace('-feira', '');
}

export function diaSemanaCurto(data) {
  return NOMES_DIA_CURTO[diaDaSemana(data)];
}

export function numeroDoDia(data) {
  return partes(data)[2];
}

/* semanas do calendário (domingo a sábado) com os dias do mês e as sobras dos meses vizinhos */
export function gradeDoMes(mes) {
  const primeiro = mes + '-01';
  const inicio = somarDias(primeiro, -diaDaSemana(primeiro));
  const dias = [];
  for (let d = inicio; d.startsWith(mes) || d < primeiro || dias.length % 7; d = somarDias(d, 1)) {
    dias.push({ data: d, fora: !d.startsWith(mes) });
  }
  return dias;
}

/* domingo da semana da data */
export function inicioDaSemana(data) {
  return somarDias(data, -diaDaSemana(data));
}

/* os 7 dias (domingo a sábado) da semana da data */
export function diasDaSemana(data) {
  const inicio = inicioDaSemana(data);
  return Array.from({ length: 7 }, (_, i) => somarDias(inicio, i));
}

const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/* "8 – 14 de novembro de 2026", "29 de nov – 5 de dez de 2026", "28 de dez de 2026 – 3 de jan de 2027" */
export function intervaloPorExtenso(de, ate) {
  const [a1, m1, d1] = partes(de);
  const [a2, m2, d2] = partes(ate);
  if (a1 === a2 && m1 === m2) return `${d1} – ${d2} de ${MESES[m2 - 1]} de ${a2}`;
  if (a1 === a2) return `${d1} de ${MESES_CURTOS[m1 - 1]} – ${d2} de ${MESES_CURTOS[m2 - 1]} de ${a2}`;
  return `${d1} de ${MESES_CURTOS[m1 - 1]} de ${a1} – ${d2} de ${MESES_CURTOS[m2 - 1]} de ${a2}`;
}

/* "Ter, 10 nov" */
export function dataCompacta(data) {
  const [, m, d] = partes(data);
  return `${NOMES_DIA_CURTO[diaDaSemana(data)]}, ${d} ${MESES_CURTOS[m - 1]}`;
}

/* "Hoje", "Amanhã", "Ontem" ou null */
export function diaRelativo(data) {
  const h = hoje();
  if (data === h) return 'Hoje';
  if (data === somarDias(h, 1)) return 'Amanhã';
  if (data === somarDias(h, -1)) return 'Ontem';
  return null;
}

export function nomeDoMes(mes) {
  return MESES[Number(mes.slice(5, 7)) - 1];
}

/* manhã até 11:59, tarde até 17:59, noite depois */
export function periodo(horario) {
  if (horario < '12:00') return 'Manhã';
  if (horario < '18:00') return 'Tarde';
  return 'Noite';
}

/* 15 → "15 minutos antes", 60 → "1 hora antes", 720 → "12 horas antes", 1440 → "1 dia antes" */
export function antecedencia(min) {
  if (min < 60) return min + ' minutos antes';
  if (min < 1440) return min === 60 ? '1 hora antes' : Math.round(min / 60) + ' horas antes';
  return min === 1440 ? '1 dia antes' : Math.round(min / 1440) + ' dias antes';
}

const ROTULO_DIA = { dom: 'domingo', seg: 'segunda', ter: 'terça', qua: 'quarta', qui: 'quinta', sex: 'sexta', sab: 'sábado' };

/* "Todos os dias", "Toda terça", "Toda segunda e quarta" */
export function descreverRecorrencia(recorrencia) {
  if (!recorrencia) return 'Não se repete';
  if (recorrencia.frequencia === 'diaria' || recorrencia.diasSemana.length === 7) return 'Todos os dias';
  const nomes = recorrencia.diasSemana.map((d) => ROTULO_DIA[d]);
  const lista = nomes.length > 1 ? nomes.slice(0, -1).join(', ') + ' e ' + nomes.at(-1) : nomes[0];
  const fem = !['sab', 'dom'].includes(recorrencia.diasSemana[0]);
  return (fem ? 'Toda ' : 'Todo ') + lista;
}
