import { IconeCheck, IconeRelogio } from './Icones.jsx';

/* card do próximo medicamento ainda pendente */
export default function CardRemedio({ med, aoTomar, aoRecusar, aoAdiar }) {
  return (
    <section className="card-remedio" aria-label="Próximo medicamento">
      <div className="pilula-chip">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#1d63dc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <g transform="rotate(-45 12 12)">
            <rect x="2.5" y="7.5" width="19" height="9" rx="4.5" /><line x1="12" y1="7.5" x2="12" y2="16.5" />
          </g>
        </svg>
      </div>
      <div className="remedio-texto" aria-live="polite">
        <small>Próximo medicamento</small>
        <strong>{med ? med.titulo : 'Tudo em dia'}</strong>
        <p className="med-quando">
          <IconeRelogio />
          <span>{med ? 'Hoje • ' + med.hora : 'Sem mais medicamentos hoje'}</span>
        </p>
      </div>
      <div className="acao-remedio">
        <button className="btn-tomei" type="button" onClick={aoTomar} disabled={!med}>
          <IconeCheck />
          Já tomei
        </button>
        <div className="acao-sec">
          <button className="btn-link" type="button" onClick={aoRecusar} disabled={!med}>Recusou</button>
          <button className="btn-link" type="button" onClick={aoAdiar} disabled={!med}>Adiar 30 min</button>
        </div>
      </div>
    </section>
  );
}
