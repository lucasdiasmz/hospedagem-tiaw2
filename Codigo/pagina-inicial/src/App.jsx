import { useState } from 'react';
import Chamada from './secoes/Chamada.jsx';
import Demonstracao from './secoes/Demonstracao.jsx';
import Hero from './secoes/Hero.jsx';
import Numeros from './secoes/Numeros.jsx';
import PorQue from './secoes/PorQue.jsx';
import Recursos from './secoes/Recursos.jsx';
import Rodape from './secoes/Rodape.jsx';
import Sobre from './secoes/Sobre.jsx';
import Topo from './secoes/Topo.jsx';

/* Página inicial pública. Quem já entrou neste aparelho vê o atalho para o Início. */
export default function App() {
  /* id da tela em que a demonstração abre, ou null */
  const [demo, setDemo] = useState(null);

  return (
    <>
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <Topo />
      <main id="conteudo" tabIndex={-1}>
        <Hero aoVerDemo={() => setDemo('inicio')} />
        <Recursos aoAbrir={setDemo} />
        <Sobre aoVerDemo={() => setDemo('inicio')} />
        <Numeros />
        <PorQue />
        <Chamada />
      </main>
      <Rodape />
      <Demonstracao inicio={demo} aoFechar={() => setDemo(null)} />
    </>
  );
}
