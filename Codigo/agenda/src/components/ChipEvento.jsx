import { IconeCheck } from './Icones.jsx';

/* compromisso compacto (semana e mês): horário + título, na cor do tipo.
   Remédios e tarefas são rotina e aparecem mais discretos. */
const ROTINA = ['medicamento', 'tarefa'];

export default function ChipEvento({ evento, rotuloTipo, aoAbrir, semHora = false }) {
  const e = evento;
  const classes = ['chip', e.tipo, 'status-' + e.status];
  if (ROTINA.includes(e.tipo)) classes.push('rotina');

  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={() => aoAbrir(e)}
      aria-label={`${e.horario}, ${rotuloTipo(e.tipo)}: ${e.titulo}` + (e.status === 'concluido' ? ', concluído' : '')
        + (e.status === 'cancelado' ? ', desmarcado' : '')}
    >
      {!semHora && <span className="chip-hora">{e.horario}</span>}
      <span className="chip-titulo">{e.titulo}</span>
      {e.status === 'concluido' && <IconeCheck />}
    </button>
  );
}
