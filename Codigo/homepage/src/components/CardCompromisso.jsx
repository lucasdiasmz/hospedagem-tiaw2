import { pad } from '../utils/hora.js';
import { ICONES_RESUMO, IconeCheck } from './Icones.jsx';

/* contagem regressiva do quadro branco: "EM 30 minutos", "EM 2h15", "Agora" */
function contador(minutos) {
  if (minutos <= 0) return { topo: '', valor: minutos < -15 ? 'Atrasado' : 'Agora', base: '', palavra: true };
  if (minutos < 60) return { topo: 'Em', valor: String(minutos), base: minutos === 1 ? 'minuto' : 'minutos' };
  const m = minutos % 60;
  return { topo: 'Em', valor: Math.floor(minutos / 60) + 'h' + (m ? pad(m) : ''), base: m ? '' : 'horas' };
}

/* destaque do próximo item pendente do dia (remédio, consulta, visita ou tarefa) */
export default function CardCompromisso({ item, minutos, aoConcluir, aoRecusar, aoAdiar }) {
  if (!item) {
    return (
      <section className="card-compromisso vazio" aria-label="Próximo compromisso">
        <div className="compromisso-texto">
          <small>Próximo compromisso</small>
          <strong>Tudo em dia</strong>
          <p className="compromisso-info">Não há mais nada pendente para hoje.</p>
        </div>
      </section>
    );
  }

  const c = contador(minutos);
  const ehMed = item.tipo === 'med';

  return (
    <section className="card-compromisso" aria-label="Próximo compromisso">
      <div className={'contador' + (c.palavra ? ' palavra' : '')} aria-hidden="true">
        {c.topo && <span className="contador-topo">{c.topo}</span>}
        <span className="contador-valor">{c.valor}</span>
        {c.base && <span className="contador-base">{c.base}</span>}
      </div>

      <div className="compromisso-texto" aria-live="polite">
        <small>Próximo compromisso · {item.hora}</small>
        <strong>{item.titulo}</strong>
        <p className="compromisso-info">
          <span className="compromisso-icone">{ICONES_RESUMO[item.tipo]}</span>
          {item.detalhe}
        </p>
      </div>

      <div className="compromisso-acoes">
        <button type="button" className="btn-claro" onClick={aoConcluir}>
          <IconeCheck />
          {ehMed ? 'Já tomei' : 'Marcar como feito'}
        </button>
        <div className="compromisso-sec">
          {ehMed && <button type="button" className="btn-contorno" onClick={aoRecusar}>Recusou</button>}
          <button type="button" className="btn-contorno" onClick={aoAdiar}>Adiar 30 min</button>
        </div>
      </div>
    </section>
  );
}
