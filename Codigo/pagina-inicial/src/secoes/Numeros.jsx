import { NUMEROS } from '../conteudo.js';

export default function Numeros() {
  return (
    <section className="numeros-faixa" aria-label="O AcessaMob em números">
      <div className="largura">
        <ul className="numeros-grade">
          {NUMEROS.map(({ valor, rotulo, Icone }) => (
            <li key={rotulo}>
              <span className="numeros-icone"><Icone tamanho={26} /></span>
              <p><strong>{valor}</strong><span>{rotulo}</span></p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
