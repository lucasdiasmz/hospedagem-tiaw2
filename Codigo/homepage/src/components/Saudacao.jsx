import { USUARIO } from '../data/cuidados.js';
import { IconeLua, IconeSol } from './Icones.jsx';

/* saudação pelo horário (sol de dia, lua à noite) */
export default function Saudacao({ subtitulo }) {
  const h = new Date().getHours();
  const saudacao = h >= 5 && h < 12 ? 'Bom dia' : h >= 12 && h < 18 ? 'Boa tarde' : 'Boa noite';
  const noite = !(h >= 5 && h < 18);

  return (
    <div className="saudacao">
      <span className="saudacao-icone" aria-hidden="true">
        {noite ? <IconeLua /> : <IconeSol />}
      </span>
      <div>
        <h1>{saudacao}, {USUARIO.nome}!</h1>
        <p>{subtitulo}</p>
      </div>
    </div>
  );
}
