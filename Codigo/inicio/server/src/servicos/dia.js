import { diaDaSemana } from './tempo.js';

/* Monta a linha do tempo de um idoso num dia, juntando as quatro fontes de itens
   (medicamentos, tarefas, consultas e agendamentos) com os registros daquele dia.

   Cada item: { chave, tipo, itemId, horarioPrevisto, horario, titulo, detalhe,
                status, horarioRegistro, registradoPor, horarioAdiado }
   "horario" é o adiado, se houver, ou o previsto. */
export async function montarDia(repo, idosoId, data) {
  const semana = diaDaSemana(data);
  const [medicamentos, tarefas, consultas, agendamentos, registros, anotacoes] = await Promise.all([
    repo.listar('medicamentos', { idosoId, ativo: true }),
    repo.listar('tarefas', { idosoId, ativo: true }),
    repo.listar('consultas', { idosoId, data }),
    repo.listar('agendamentos', { idosoId, data }),
    repo.listar('registros', { idosoId, data }),
    repo.listar('anotacoes', { idosoId, data }),
  ]);

  const previstos = [];

  medicamentos.forEach((m) => {
    m.horarios.forEach((h) => previstos.push({
      tipo: 'medicamento', itemId: m.id, horarioPrevisto: h,
      titulo: m.nome + ' ' + m.dosagem, detalhe: m.categoria || 'Medicação',
    }));
  });

  tarefas.filter((t) => t.diasSemana.includes(semana)).forEach((t) => previstos.push({
    tipo: 'tarefa', itemId: t.id, horarioPrevisto: t.horario, titulo: t.titulo, detalhe: 'Tarefa',
  }));

  consultas.filter((c) => c.status !== 'cancelada').forEach((c) => previstos.push({
    tipo: 'consulta', itemId: c.id, horarioPrevisto: c.horario,
    titulo: 'Consulta: ' + c.especialidade, detalhe: [c.profissional, c.local].filter(Boolean).join(' · '),
  }));

  for (const a of agendamentos.filter((a) => a.status !== 'cancelado')) {
    const cuidador = await repo.buscar('cuidadores', a.cuidadorId);
    const usuario = cuidador && await repo.buscar('usuarios', cuidador.usuarioId);
    previstos.push({
      tipo: 'agendamento', itemId: a.id, horarioPrevisto: a.horaInicio,
      titulo: 'Visita de ' + (usuario?.nome || 'cuidador(a)'), detalhe: a.horaInicio + ' às ' + a.horaFim,
    });
  }

  const chaveDe = (x) => x.tipo + ':' + x.itemId + '@' + x.horarioPrevisto;
  const porChave = new Map(registros.map((r) => [chaveDe(r), r]));

  const itens = previstos.map((p) => {
    const r = porChave.get(chaveDe(p)) || {};
    return {
      chave: chaveDe(p),
      ...p,
      horario: r.horarioAdiado || p.horarioPrevisto,
      status: r.status || null,
      horarioRegistro: r.horarioRegistro || null,
      registradoPor: r.registradoPor || null,
      horarioAdiado: r.horarioAdiado || null,
    };
  });

  itens.sort((a, b) => a.horario.localeCompare(b.horario));
  anotacoes.sort((a, b) => a.hora.localeCompare(b.hora));
  return { idosoId, data, itens, anotacoes };
}
