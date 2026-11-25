import { useEffect, useState } from 'react';
import Dialogo from '@ds/Dialogo.jsx';
import { IconePausa, IconeTocar, SetaDireita, SetaEsquerda } from '@ds/Icones.jsx';
import { DEMONSTRACAO } from '../conteudo.js';

const PAUSA = 5000;
const semMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* passa as telas sozinha; qualquer escolha da pessoa para a passagem */
function Passagem({ inicio }) {
  const [passo, setPasso] = useState(() => Math.max(0, DEMONSTRACAO.findIndex((d) => d.id === inicio)));
  const [tocando, setTocando] = useState(() => inicio === 'inicio' && !semMovimento());
  const atual = DEMONSTRACAO[passo];

  useEffect(() => {
    if (!tocando) return undefined;
    const t = setTimeout(() => {
      if (passo + 1 < DEMONSTRACAO.length) setPasso(passo + 1);
      else setTocando(false);
    }, PAUSA);
    return () => clearTimeout(t);
  }, [tocando, passo]);

  function ir(n) {
    setTocando(false);
    setPasso((n + DEMONSTRACAO.length) % DEMONSTRACAO.length);
  }

  function tocar() {
    if (!tocando && passo === DEMONSTRACAO.length - 1) setPasso(0);
    setTocando(!tocando);
  }

  return (
    <div className="demo">
      <div className="demo-aparelho">
        <img key={atual.id} src={atual.tela} width="585" height="1260" alt={'Tela ' + atual.titulo + ' do AcessaMob, com dados de exemplo'} />
      </div>
      <div className="demo-lado">
        <div className="demo-fala" aria-live={tocando ? 'off' : 'polite'}>
          <h3>{atual.titulo}</h3>
          <p>{atual.texto}</p>
        </div>
        <ol className="demo-lista">
          {DEMONSTRACAO.map((d, n) => (
            <li key={d.id}>
              <button type="button" aria-current={n === passo ? 'step' : undefined} onClick={() => ir(n)}>{d.titulo}</button>
            </li>
          ))}
        </ol>
        <div className="demo-botoes">
          <button type="button" className="btn-icone" aria-label="Tela anterior" onClick={() => ir(passo - 1)}><SetaEsquerda /></button>
          <button type="button" className="btn btn-primario" onClick={tocar}>
            {tocando ? <IconePausa /> : <IconeTocar />}{tocando ? 'Pausar' : 'Tocar'}
          </button>
          <button type="button" className="btn-icone" aria-label="Próxima tela" onClick={() => ir(passo + 1)}><SetaDireita /></button>
        </div>
      </div>
    </div>
  );
}

export default function Demonstracao({ inicio, aoFechar }) {
  return (
    <Dialogo aberto={inicio !== null} aoFechar={aoFechar} titulo="Como funciona" descricao="Telas reais, com dados de exemplo." largo className="dialogo--demo">
      <Passagem inicio={inicio} />
    </Dialogo>
  );
}
