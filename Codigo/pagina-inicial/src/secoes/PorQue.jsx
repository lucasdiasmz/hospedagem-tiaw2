import { MOTIVOS } from '../conteudo.js';
import { Selo } from './pecas.jsx';

export default function PorQue() {
  return (
    <section id="por-que" className="por-que" aria-labelledby="titulo-por-que">
      <div className="largura por-que-grade">
        <div className="por-que-texto">
          <Selo>Por que o AcessaMob</Selo>
          <h2 id="titulo-por-que">Feito para quem cuida e para quem é cuidado</h2>
          <p>Botões grandes, texto claro e uma tela mais simples para a própria pessoa idosa. Quem recebe o cuidado também usa.</p>
        </div>
        <ul className="motivos">
          {MOTIVOS.map(({ titulo, texto, Icone }) => (
            <li key={titulo}>
              <span className="motivo-icone"><Icone tamanho={24} /></span>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
