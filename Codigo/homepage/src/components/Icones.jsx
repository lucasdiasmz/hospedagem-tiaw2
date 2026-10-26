/* Ícones SVG usados na tela inicial */

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function Logo() {
  return (
    <svg width="46" height="42" viewBox="0 0 48 44" aria-hidden="true">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fc0ff" />
          <stop offset="1" stopColor="#2468e0" />
        </linearGradient>
      </defs>
      <path d="M24 42S3 29 3 14.5C3 7.6 8.2 3 14 3c4 0 8 2.3 10 6 2-3.7 6-6 10-6 5.8 0 11 4.6 11 11.5C45 29 24 42 24 42z" fill="url(#hg)" />
      <path d="M24 14v14M17 21h14" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function IconeInicio() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco}>
      <path d="M3 11.5L12 3l9 8.5" /><path d="M5.5 10v10.5h13V10" /><path d="M10 20.5v-6h4v6" />
    </svg>
  );
}

export function IconeAgenda(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco} {...props}>
      <rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

export function IconePilula(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco} {...props}>
      <g transform="rotate(-45 12 12)">
        <rect x="2" y="7.5" width="20" height="9" rx="4.5" /><line x1="12" y1="7.5" x2="12" y2="16.5" />
      </g>
    </svg>
  );
}

export function IconeHistorico() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5" /><path d="M3.5 4v4.5H8" /><path d="M12 8v4.5l3 2" />
    </svg>
  );
}

export function IconePerfis() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco}>
      <circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6" />
      <circle cx="17" cy="9" r="2.5" /><path d="M17 14c3 0 4.5 2 4.5 5" />
    </svg>
  );
}

export function IconeMais({ width, height, strokeWidth = '1.8' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" strokeWidth={strokeWidth} {...traco}>
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

export function IconeHorarios() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco}>
      <rect x="3.5" y="5" width="17" height="16" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" />
      <path d="M8 14h2M14 14h2M8 17.5h2" strokeWidth="2" />
    </svg>
  );
}

export function IconeAjuda() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path className="furo" d="M9.4 9.6a2.6 2.6 0 1 1 3.6 2.4c-.8.4-1.1.9-1.1 1.7" fill="none" strokeWidth="2" strokeLinecap="round" />
      <circle className="furo-cheio" cx="11.9" cy="17" r="1.2" />
    </svg>
  );
}

export function SetaDireita() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function SetaBaixo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function Ondas() {
  return (
    <svg className="ondas" viewBox="0 0 313 150" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 70C50 20 110 10 170 40s100 30 143-10v120H0z" fill="rgba(70,130,255,.12)" />
      <path d="M0 100C60 60 120 70 190 90s90 0 123-20v80H0z" fill="rgba(70,130,255,.1)" />
    </svg>
  );
}

export function IconeBusca() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" />
    </svg>
  );
}

export function IconeSino() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.8" {...traco}>
      <path d="M6 17h12l-1.5-2v-4.5a4.5 4.5 0 0 0-9 0V15z" /><path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconeSol() {
  return (
    <svg width="50" height="50" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="9.5" fill="#fbbf24" />
      <g stroke="#f5a524" strokeWidth="3.2" strokeLinecap="round">
        <path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2" />
      </g>
    </svg>
  );
}

/* sol nascendo no horizonte (manhã) */
export function IconeSolNascente() {
  return (
    <svg width="50" height="50" viewBox="0 0 48 48">
      <path d="M13.5 34a10.5 10.5 0 0 1 21 0z" fill="#fbbf24" />
      <g stroke="#f5a524" strokeWidth="3.2" strokeLinecap="round">
        <path d="M24 10v6M7.8 19.8l4.2 4.2M40.2 19.8 36 24M4 34h4M40 34h4M6 41h36" />
      </g>
    </svg>
  );
}

/* lua com estrelas (noite) */
export function IconeLua() {
  return (
    <svg width="50" height="50" viewBox="0 0 48 48">
      <path d="M28 8a17 17 0 1 0 12 27A14 14 0 0 1 28 8z" fill="#a9c4f2" />
      <path d="M38 6l1.3 3.2L42.5 10.5l-3.2 1.3L38 15l-1.3-3.2-3.2-1.3 3.2-1.3z" fill="#fbbf24" />
      <circle cx="43" cy="20" r="1.8" fill="#fbbf24" />
    </svg>
  );
}

export function IconeCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="3" {...traco}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ícones do resumo "Seus cuidados de hoje" */
export const ICONES_RESUMO = {
  med: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <g transform="rotate(-45 12 12)">
        <rect x="2.5" y="8" width="19" height="8" rx="4" /><line x1="12" y1="8" x2="12" y2="16" />
      </g>
    </svg>
  ),
  consulta: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M5 3h2M13 3h2M6 3v5a4 4 0 0 0 8 0V3" /><path d="M10 12v3a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="11" r="2" />
    </svg>
  ),
  tarefa: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 12l3 3 5-6" />
    </svg>
  ),
  visita: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" />
    </svg>
  ),
};
