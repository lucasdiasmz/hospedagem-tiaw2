/* Ícones SVG usados na agenda */

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function IconeInicio() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco}>
      <path d="M3 11.5L12 3l9 8.5" /><path d="M5.5 10v10.5h13V10" /><path d="M10 20.5v-6h4v6" />
    </svg>
  );
}

export function IconeAgenda() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco}>
      <rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

export function IconePilula() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco}>
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

export function IconeMais({ strokeWidth = '1.8' }) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={strokeWidth} {...traco}>
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

export function SetaDireita({ className, tamanho = 18 }) {
  return (
    <svg className={className} width={tamanho} height={tamanho} viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function SetaEsquerda() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function IconeRepetir() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M17 2l3 3-3 3" /><path d="M4 11V9a4 4 0 0 1 4-4h12" />
      <path d="M7 22l-3-3 3-3" /><path d="M20 13v2a4 4 0 0 1-4 4H4" />
    </svg>
  );
}

export function IconeSino() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
    </svg>
  );
}

export function IconeRelogio() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconeCheck() {
  return (
    <svg className="icone-check" viewBox="0 0 24 24" strokeWidth="3" {...traco}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function IconeFechar() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M6 6l12 12M18 6L6 18" />
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

/* ícone de cada tipo de compromisso (ids de catalogos.tiposEvento) */
export const ICONES_TIPO = {
  consulta: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M5 3h2M13 3h2M6 3v5a4 4 0 0 0 8 0V3" /><path d="M10 12v3a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="11" r="2" />
    </svg>
  ),
  exame: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" /><path d="M7.5 15h9" />
    </svg>
  ),
  visita: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" />
    </svg>
  ),
  medicamento: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <g transform="rotate(-45 12 12)">
        <rect x="2.5" y="8" width="19" height="8" rx="4" /><line x1="12" y1="8" x2="12" y2="16" />
      </g>
    </svg>
  ),
  tarefa: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 12l3 3 5-6" />
    </svg>
  ),
};

export function IconeTarefas(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco} {...props}>
      <rect x="4" y="4" width="16" height="17" rx="3" /><path d="M9 3v3h6V3" /><path d="M8.5 13l2.5 2.5 4.5-5" />
    </svg>
  );
}

/* ícones dos módulos integrados (menu lateral) */
export function IconeLinhaDoTempo(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco} {...props}>
      <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" /><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function IconeCuidadores(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" {...traco} {...props}>
      <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" />
    </svg>
  );
}
