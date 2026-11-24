/* Ícones próprios da tela inicial. Os do menu e os comuns ficam em Codigo/design-system/Icones.jsx */

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

/* períodos do dia (saudação) — traço, na cor do texto */
export function IconeSol() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </svg>
  );
}

export function IconeSolNascente() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M7 17a5 5 0 0 1 10 0" /><path d="M12 5v3M4.6 10.6l1.8 1.8M19.4 10.6l-1.8 1.8M2.5 17h2M19.5 17h2M3 21h18" />
    </svg>
  );
}

export function IconeLua() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z" />
    </svg>
  );
}

/* despertador: item atrasado */
export function IconeDespertador() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <circle cx="12" cy="13" r="7.5" /><path d="M12 9.5V13l2.5 1.5" /><path d="M3.5 5.5l3-2.5M20.5 5.5l-3-2.5M6.5 19.5 5 21M17.5 19.5 19 21" />
    </svg>
  );
}

/* sino tocando: está na hora */
export function IconeSinoTocando() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8h-17S6 15 6 9" /><path d="M10.3 20.5a1.9 1.9 0 0 0 3.4 0" /><path d="M2.5 8.5a9 9 0 0 1 2-4.5M21.5 8.5a9 9 0 0 0-2-4.5" />
    </svg>
  );
}

/* ícones por tipo de item do dia */
export const ICONES_TIPO = {
  med: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <g transform="rotate(-45 12 12)"><rect x="2.5" y="8" width="19" height="8" rx="4" /><path d="M12 8v8" /></g>
    </svg>
  ),
  consulta: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M5 3h2M13 3h2M6 3v5a4 4 0 0 0 8 0V3" /><path d="M10 12v3a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="11" r="2" />
    </svg>
  ),
  tarefa: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path d="m8 12 3 3 5-6" />
    </svg>
  ),
  visita: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" />
    </svg>
  ),
  nota: (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" />
    </svg>
  ),
};

export const NOMES_TIPO = { med: 'Remédio', consulta: 'Consulta', tarefa: 'Tarefa', visita: 'Visita', nota: 'Anotação' };
