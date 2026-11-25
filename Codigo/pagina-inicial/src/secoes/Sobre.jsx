import { IconeInicio } from '@ds/Icones.jsx';
import foto from '../imagens/sobre-familia.webp';
import { LINKS } from '../conteudo.js';
import { BotaoSeta, BotaoTocar, Selo, SeloFlutuante } from './pecas.jsx';

export default function Sobre({ aoVerDemo }) {
  return (
    <section id="sobre" className="sobre" aria-labelledby="titulo-sobre">
      <div className="largura sobre-grade">
        <div className="sobre-foto">
          <img src={foto} width="1200" height="812" loading="lazy" alt="Duas mulheres no sofá de casa, rindo enquanto olham um tablet" />
          <SeloFlutuante className="flutuante--sobre" Icone={IconeInicio} titulo="Feito na PUC Minas" texto="Engenharia de Software, 2026" />
        </div>
        <div className="sobre-texto">
          <Selo>Sobre o AcessaMob</Selo>
          <h2 id="titulo-sobre">Uma rede de apoio <span className="realce">para quem cuida</span></h2>
          <p>
            Cuidar de alguém costuma sobrar para uma pessoa só. O AcessaMob divide remédios, consultas e tarefas entre a
            família e os cuidadores, e deixa registrado o que aconteceu no dia.
          </p>
          <div className="acoes">
            <BotaoSeta href={LINKS.cuidador}>Sou cuidador(a)</BotaoSeta>
            <BotaoTocar aoClicar={aoVerDemo} titulo="Conheça as telas" detalhe="Demonstração" />
          </div>
        </div>
      </div>
    </section>
  );
}
