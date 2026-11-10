import { pad } from '../utils/hora.js';
import { ICONES_RESUMO, IconeCheck } from './Icones.jsx';

/* despertador tocando: item atrasado */
function IconeDespertador() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="13" r="7.5" /><path d="M12 9.5V13l2.5 1.5" /><path d="M3.5 5.5l3-2.5M20.5 5.5l-3-2.5M6.5 19.5L5 21M17.5 19.5L19 21" />
    </svg>
  );
}

/* sino tocando: está na hora */
function IconeSinoTocando() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8h-17S6 15 6 9" /><path d="M10.3 20.5a1.9 1.9 0 0 0 3.4 0" /><path d="M2.5 8.5a9 9 0 0 1 2-4.5M21.5 8.5a9 9 0 0 0-2-4.5" />
    </svg>
  );
}

/* contagem regressiva do quadro branco: "EM 30 minutos", "EM 2h15"; na hora ou atrasado vira ícone animado */
function contador(minutos) {
  if (minutos < -15) {
    const atraso = -minutos;
    const texto = atraso < 60 ? atraso + ' min' : Math.floor(atraso / 60) + 'h' + (atraso % 60 ? pad(atraso % 60) : '');
    return { alerta: 'atrasado', base: 'há ' + texto };
  }
  if (minutos <= 0) return { alerta: 'agora', base: 'agora' };
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
      <div className={'contador' + (c.alerta ? ' ' + c.alerta : '')} aria-hidden="true">
        {c.alerta ? (
          <span className="contador-icone">{c.alerta === 'atrasado' ? <IconeDespertador /> : <IconeSinoTocando />}</span>
        ) : (
          <>
            <span className="contador-topo">{c.topo}</span>
            <span className="contador-valor">{c.valor}</span>
          </>
        )}
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
