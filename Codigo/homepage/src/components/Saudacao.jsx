import { USUARIO } from '../data/cuidados.js';
import { IconeLua, IconeSol, IconeSolNascente } from './Icones.jsx';

/* manhã 05:00–11:59, tarde 12:00–17:59, noite 18:00–04:59 */
const PERIODOS = {
  manha: { saudacao: 'Bom dia', icone: <IconeSolNascente /> },
  tarde: { saudacao: 'Boa tarde', icone: <IconeSol /> },
  noite: { saudacao: 'Boa noite', icone: <IconeLua /> },
};

function periodoAtual() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'manha';
  if (h >= 12 && h < 18) return 'tarde';
  return 'noite';
}

/* saudação e ícone pelo horário; o App re-renderiza a cada 30 s, então a troca acontece sozinha */
export default function Saudacao({ subtitulo }) {
  const { saudacao, icone } = PERIODOS[periodoAtual()];

  return (
    <div className="saudacao">
      <span className="saudacao-icone" aria-hidden="true">{icone}</span>
      <div>
        <h1>{saudacao}, {USUARIO.nome}!</h1>
        <p>{subtitulo}</p>
      </div>
    </div>
  );
}
