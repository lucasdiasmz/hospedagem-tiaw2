/* Ícones da agenda. Os comuns vêm do design system (Codigo/design-system/Icones.jsx). */
export {
  IconeCheck, IconeFechar, IconeMais, IconeRelogio, IconeRepetir, SetaDireita, SetaEsquerda,
} from '@ds/Icones.jsx';

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function IconeSino() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" {...traco}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
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
