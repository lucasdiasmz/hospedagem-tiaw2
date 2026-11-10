/* Ícones SVG usados na tela de cadastro (mesmo traço da tela inicial) */

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

export function IconeMais() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco}>
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

export function IconeLista() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco}>
      <path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" strokeWidth="3" />
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

export function IconeSino() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.8" {...traco}>
      <path d="M6 17h12l-1.5-2v-4.5a4.5 4.5 0 0 0-9 0V15z" /><path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconeTarefas(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco} {...props}>
      <rect x="4" y="4" width="16" height="17" rx="3" /><path d="M9 3v3h6V3" /><path d="M8.5 13l2.5 2.5 4.5-5" />
    </svg>
  );
}

export function IconeCarrinho(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco} {...props}>
      <path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H6.4" /><circle cx="9.5" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" />
    </svg>
  );
}

export function IconeEstetoscopio(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco} {...props}>
      <path d="M6 3v6a4 4 0 0 0 8 0V3" /><path d="M10 13v2.5a4.5 4.5 0 0 0 9 0V13" /><circle cx="19" cy="11" r="2" />
    </svg>
  );
}

export function IconeEstrela(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco} {...props}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  );
}

export function IconeFechar(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconeLixeira(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco} {...props}>
      <path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13" />
    </svg>
  );
}
