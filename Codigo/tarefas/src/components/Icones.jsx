/* Ícones das tarefas. Os comuns vêm do design system (Codigo/design-system/Icones.jsx). */
export {
  IconeFechar, IconeLixeira, IconeMais, IconePerfis, IconePilula, IconeTarefas, SetaBaixo,
} from '@ds/Icones.jsx';

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function IconeCarrinho(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" strokeWidth="1.8" {...traco} {...props}>
      <path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H6.4" /><circle cx="9.5" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" />
    </svg>
  );
}

export function IconeEstetoscopio(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" strokeWidth="1.8" {...traco} {...props}>
      <path d="M6 3v6a4 4 0 0 0 8 0V3" /><path d="M10 13v2.5a4.5 4.5 0 0 0 9 0V13" /><circle cx="19" cy="11" r="2" />
    </svg>
  );
}

export function IconeEstrela(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" strokeWidth="1.8" {...traco} {...props}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  );
}
