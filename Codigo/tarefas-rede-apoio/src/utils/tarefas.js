import { USUARIO } from '../data/db.js';

export const ABAS = [
  { status: 'a_fazer', rotulo: 'A fazer' },
  { status: 'em_andamento', rotulo: 'Em andamento' },
  { status: 'concluido', rotulo: 'Concluído' },
];

/* data e hora locais no formato do JSON: 2026-11-10T12:00:00 */
export function agoraIso() {
  const local = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 19);
}

export function hojeIso() {
  return agoraIso().slice(0, 10);
}

/* "Hoje · 08:00", "Amanhã · 12:00" ou "17/11 · 08:00" */
export function formatarPrazo(prazo) {
  const data = prazo.slice(0, 10);
  const hora = prazo.slice(11, 16);
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const amanhaIso = new Date(amanha - amanha.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  let dia = data.slice(8, 10) + '/' + data.slice(5, 7);
  if (data === hojeIso()) dia = 'Hoje';
  if (data === amanhaIso) dia = 'Amanhã';
  return dia + ' · ' + hora;
}

export function atrasada(tarefa) {
  return tarefa.status !== 'concluido' && tarefa.prazo < agoraIso();
}

export function nomeCurto(membro) {
  if (!membro) return 'Sem responsável';
  if (membro.id === USUARIO.id) return 'Você';
  return membro.nome.split(' ')[0];
}

export function iniciais(nome) {
  const partes = nome.split(' ');
  return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase();
}

export function dinheiro(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* sugere quem tem menos tarefas abertas (a fazer + em andamento) */
export function sugerirResponsavel(membros, tarefas) {
  const abertas = (id) => tarefas.filter((t) => t.responsavelId === id && t.status !== 'concluido').length;
  return membros.reduce((menor, m) => (abertas(m.id) < abertas(menor.id) ? m : menor), membros[0]);
}

/* percentual das tarefas concluídas que cada membro fez */
export function divisaoDoCuidado(membros, tarefas) {
  const concluidas = tarefas.filter((t) => t.status === 'concluido');
  return membros.map((m) => {
    const feitas = concluidas.filter((t) => t.responsavelId === m.id).length;
    const pct = concluidas.length ? Math.round((feitas / concluidas.length) * 100) : 0;
    return { ...m, feitas, pct };
  });
}

/* devolve um objeto { campo: mensagem } com os erros; vazio quando está tudo certo */
export function validar(t) {
  const erros = {};
  if (!t.titulo.trim()) erros.titulo = 'Informe o título da tarefa.';
  if (!t.responsavelId) erros.responsavelId = 'Escolha o responsável.';
  if (!t.data || !t.hora) erros.prazo = 'Informe a data e a hora do prazo.';
  else if (t.data + 'T' + t.hora + ':00' < agoraIso()) erros.prazo = 'O prazo não pode estar no passado.';
  if (t.categoria === 'Compra') {
    if (t.itens.some((i) => !i.nome.trim())) erros.itens = 'Dê um nome para todos os itens.';
    else if (t.itens.some((i) => i.preco === '' || Number(i.preco) < 0)) erros.itens = 'Informe preços válidos (zero ou mais).';
  }
  return erros;
}
