import { IconeLua, IconeSol, IconeSolNascente } from './Icones.jsx';

/* manhã 05:00–11:59, tarde 12:00–17:59, noite 18:00–04:59 */
const PERIODOS = {
  manha: { saudacao: 'Bom dia', Icone: IconeSolNascente },
  tarde: { saudacao: 'Boa tarde', Icone: IconeSol },
  noite: { saudacao: 'Boa noite', Icone: IconeLua },
};

function periodoAtual() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'manha';
  if (h >= 12 && h < 18) return 'tarde';
  return 'noite';
}

/* "Maria Silva" → "Maria" */
function primeiroNome(nome = '') {
  return nome.trim().split(/\s+/)[0];
}

const DATA = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

/* saudação e ícone pelo horário; o App re-renderiza a cada 30 s, então a troca acontece sozinha */
export default function Saudacao({ nome, idoso, subtitulo }) {
  const { saudacao, Icone } = PERIODOS[periodoAtual()];
  const hoje = DATA.format(new Date());

  return (
    <header className="saudacao">
      <p className="saudacao-data">
        <Icone />
        <span>{hoje.charAt(0).toUpperCase() + hoje.slice(1)}</span>
        {idoso && <span className="saudacao-idoso">· cuidando de {primeiroNome(idoso)}</span>}
      </p>
      <h1>{nome ? saudacao + ', ' + primeiroNome(nome) : saudacao}</h1>
      <p className="saudacao-sub" aria-live="polite">{subtitulo}</p>
    </header>
  );
}
