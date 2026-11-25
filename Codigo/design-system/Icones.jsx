/* Ícones do AcessaMob: grade de 24 px (em rem, para acompanhar a letra maior), traço de 1.8, pontas arredondadas.
   Todos herdam a cor do texto (currentColor) e são decorativos (aria-hidden);
   o nome acessível fica no botão ou link que os contém. */

function Svg({ children, tamanho = 24, traco = 1.8, ...resto }) {
  return (
    <svg
      width={tamanho / 16 + 'rem'}
      height={tamanho / 16 + 'rem'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={traco}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...resto}
    >
      {children}
    </svg>
  );
}

export const IconeInicio = (p) => (
  <Svg {...p}><path d="M3.5 11 12 3.8l8.5 7.2" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5.5h4V20" /></Svg>
);
export const IconeAgenda = (p) => (
  <Svg {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" strokeWidth="2.4" /></Svg>
);
export const IconePilula = (p) => (
  <Svg {...p}><g transform="rotate(-45 12 12)"><rect x="2.5" y="8" width="19" height="8" rx="4" /><path d="M12 8v8" /></g></Svg>
);
export const IconeTarefas = (p) => (
  <Svg {...p}><rect x="4.5" y="4.5" width="15" height="16.5" rx="3" /><path d="M9 3v3h6V3" /><path d="m8.8 13.2 2.3 2.3 4.2-4.6" /></Svg>
);
export const IconeLinhaDoTempo = (p) => (
  <Svg {...p}><path d="M3 4.5h5.5A3.5 3.5 0 0 1 12 8v12.5a2.8 2.8 0 0 0-2.8-2.8H3z" /><path d="M21 4.5h-5.5A3.5 3.5 0 0 0 12 8v12.5a2.8 2.8 0 0 1 2.8-2.8H21z" /></Svg>
);
export const IconeCuidadores = (p) => (
  <Svg {...p}><path d="M19.2 13.6c1.4-1.4 2.6-3 2.6-5A5.1 5.1 0 0 0 16.7 3.5c-1.7 0-2.9.6-4.7 2.3C10.2 4.1 9 3.5 7.3 3.5A5.1 5.1 0 0 0 2.2 8.6c0 2 1.2 3.6 2.6 5L12 20.5z" /></Svg>
);
export const IconePerfis = (p) => (
  <Svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.9 2.9-6 6.5-6s6.5 2.1 6.5 6" /><circle cx="17" cy="9" r="2.5" /><path d="M17 14c2.8 0 4.5 1.9 4.5 5" /></Svg>
);
export const IconeMenu = (p) => (
  <Svg {...p}><circle cx="5.5" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="18.5" cy="12" r="1.3" fill="currentColor" stroke="none" /></Svg>
);
export const IconeBarras = (p) => <Svg traco={2} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>;
export const IconeMais = (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const IconeFechar = (p) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>;
export const IconeCheck = (p) => <Svg traco={2.4} {...p}><path d="m5 12.5 4.2 4.2L19 7" /></Svg>;
export const SetaDireita = (p) => <Svg traco={2} {...p}><path d="m9 6 6 6-6 6" /></Svg>;
export const SetaEsquerda = (p) => <Svg traco={2} {...p}><path d="m15 6-6 6 6 6" /></Svg>;
export const SetaBaixo = (p) => <Svg traco={2} {...p}><path d="m6 9 6 6 6-6" /></Svg>;
export const IconeVoltar = (p) => <Svg traco={2} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>;
export const IconeAjuda = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.6 2.6 0 1 1 3.5 2.4c-.7.3-1 .8-1 1.6" /><path d="M12 16.8h.01" strokeWidth="2.6" /></Svg>
);
export const IconeSos = (p) => (
  <Svg {...p}><path d="M12 3.5 21 19H3z" /><path d="M12 10v4" /><path d="M12 16.6h.01" strokeWidth="2.6" /></Svg>
);
export const IconeLetra = (p) => (
  <Svg {...p}><path d="M3 18 8 6l5 12M4.8 14h6.4" /><path d="M15 18l3-7.5 3 7.5M15.9 15.8h4.2" /></Svg>
);
export const IconeContraste = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor" /></Svg>
);
export const IconeBusca = (p) => <Svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></Svg>;
export const IconeFiltro = (p) => <Svg {...p}><path d="M4 6h16M7 12h10M10 18h4" /></Svg>;
export const IconeEstrela = ({ cheia = true, ...p }) => (
  <Svg traco={1.6} {...p}>
    <path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill={cheia ? 'currentColor' : 'none'} />
  </Svg>
);
export const IconeLocal = (p) => (
  <Svg {...p}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></Svg>
);
export const IconeRelogio = (p) => <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Svg>;
export const IconeTelefone = (p) => (
  <Svg {...p}><path d="M5 3.5h3.5l1.8 4.6-2.3 1.4a11 11 0 0 0 6.5 6.5l1.4-2.3 4.6 1.8V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.1A1.5 1.5 0 0 1 5 3.5z" /></Svg>
);
export const IconeEscudo = (p) => (
  <Svg {...p}><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6z" /><path d="m8.8 12 2.2 2.2 4.2-4.4" /></Svg>
);
export const IconeLapis = (p) => <Svg {...p}><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></Svg>;
export const IconeLixeira = (p) => (
  <Svg {...p}><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" /><path d="M10 11v5.5M14 11v5.5" /></Svg>
);
export const IconeAlerta = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.8v4.8" /><path d="M12 16.2h.01" strokeWidth="2.6" /></Svg>
);
export const IconeSair = (p) => <Svg {...p}><path d="M14 4h4.5a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5H14" /><path d="M10 8l-4 4 4 4M6 12h10" /></Svg>;
export const IconeRepetir = (p) => <Svg {...p}><path d="M4 11V9.5A3.5 3.5 0 0 1 7.5 6H19l-3-3M20 13v1.5a3.5 3.5 0 0 1-3.5 3.5H5l3 3" /></Svg>;
export const SetaLonga = (p) => <Svg traco={2} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const IconeTocar = (p) => <Svg {...p}><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></Svg>;
export const IconePausa = (p) => <Svg traco={2.6} {...p}><path d="M9 6v12M15 6v12" /></Svg>;
export const IconeToque = (p) => (
  <Svg {...p}><path d="M9.5 13.5V6.8a1.7 1.7 0 0 1 3.4 0v4.7l4.3 1a2.4 2.4 0 0 1 1.8 2.8l-.6 3.2a2.7 2.7 0 0 1-2.7 2.2h-2.9a3 3 0 0 1-2.4-1.2L6 14.8a1.5 1.5 0 0 1 2.2-2z" /><path d="M6.5 8.5a4.8 4.8 0 1 1 9.4-1.8" /></Svg>
);
