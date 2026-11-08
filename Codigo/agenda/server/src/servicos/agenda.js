import { diaDaSemana } from './tempo.js';

/* coleção de origem do evento → "tipo" usado nos registros do dia (a homepage grava esses registros) */
const TIPO_REGISTRO = {
  medicamentos: 'medicamento',
  tarefas: 'tarefa',
  consultas: 'consulta',
  agendamentos: 'agendamento',
};

/* tipos de rotina: aparecem no calendário, mas não em "Próximos dias" */
const ROTINA = ['medicamento', 'tarefa'];

/* "2026-10-30" + 3 → "2026-11-02" */
export function somarDias(data, n) {
  const d = new Date(data + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/* "2026-10" → ["2026-10-01", ..., "2026-10-31"] */
export function diasDoMes(mes) {
  const dias = [];
  for (let d = mes + '-01'; d.startsWith(mes); d = somarDias(d, 1)) dias.push(d);
  return dias;
}

/* o evento acontece nessa data? (eventos recorrentes valem a partir da data de início) */
export function aconteceEm(evento, data) {
  if (data < evento.data) return false;
  if (!evento.recorrencia) return data === evento.data;
  return evento.recorrencia.diasSemana.includes(diaDaSemana(data));
}

const chaveRegistro = (tipo, itemId, data, horario) => `${tipo}:${itemId}@${data}@${horario}`;

/* Uma ocorrência do evento num dia.
   Status: cancelado vale para todos os dias; nas repetições o status volta a "confirmado";
   e se o item foi registrado como feito na tela inicial, a ocorrência fica "concluido". */
function ocorrencia(evento, data, registros) {
  let status = evento.status;
  if (status !== 'cancelado') {
    if (evento.recorrencia && data !== evento.data) status = 'confirmado';
    const tipo = evento.origem && TIPO_REGISTRO[evento.origem.colecao];
    const registro = tipo && registros.get(chaveRegistro(tipo, evento.origem.id, data, evento.horario));
    if (registro?.status === 'feito') status = 'concluido';
  }
  return {
    chave: evento.id + '@' + data,
    eventoId: evento.id,
    tipo: evento.tipo,
    data,
    horario: evento.horario,
    titulo: evento.titulo,
    subtitulo: evento.subtitulo || '',
    status,
    recorrencia: evento.recorrencia || null,
    lembrete: evento.lembrete || null,
    origem: evento.origem || null,
  };
}

/* ocorrências dos eventos do idoso entre duas datas (inclusive), em ordem de data e horário */
export async function ocorrenciasEntre(repo, idosoId, de, ate) {
  const [eventos, registros] = await Promise.all([
    repo.listar('eventosAgenda', { idosoId }),
    repo.listar('registros', { idosoId }),
  ]);
  const porChave = new Map(
    registros
      .filter((r) => r.data >= de && r.data <= ate)
      .map((r) => [chaveRegistro(r.tipo, r.itemId, r.data, r.horarioPrevisto), r]),
  );

  const lista = [];
  for (let data = de; data <= ate; data = somarDias(data, 1)) {
    eventos.filter((e) => aconteceEm(e, data)).forEach((e) => lista.push(ocorrencia(e, data, porChave)));
  }
  return lista.sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));
}

/* agenda do mês: ocorrências e resumo por tipo (cancelados não contam) */
export async function montarMes(repo, idosoId, mes) {
  const dias = diasDoMes(mes);
  const [eventos, medicamentos] = await Promise.all([
    ocorrenciasEntre(repo, idosoId, dias[0], dias.at(-1)),
    repo.listar('medicamentos', { idosoId, ativo: true }),
  ]);
  const validos = eventos.filter((e) => e.status !== 'cancelado');
  const contar = (tipo) => validos.filter((e) => e.tipo === tipo).length;
  return {
    idosoId,
    mes,
    eventos,
    resumo: {
      consulta: contar('consulta'),
      exame: contar('exame'),
      visita: contar('visita'),
      /* remédios em uso, do cadastro de medicamentos */
      medicamento: medicamentos.length,
    },
  };
}

/* próximos compromissos depois de "data" (sem remédios e tarefas de rotina), olhando até 90 dias */
export async function proximos(repo, idosoId, data, limite) {
  const eventos = await ocorrenciasEntre(repo, idosoId, somarDias(data, 1), somarDias(data, 90));
  return eventos.filter((e) => !ROTINA.includes(e.tipo) && e.status !== 'cancelado').slice(0, limite);
}
