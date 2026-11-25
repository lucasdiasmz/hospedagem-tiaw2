import { IconeCuidadores, IconePerfis, IconeToque } from '@ds/Icones.jsx';
import { usePreferencias } from '@ds/preferencias.js';
import foto from '@ds/assets/hero-cuidador.webp';
import celular from '../imagens/celular.webp';
import { LINKS } from '../conteudo.js';
import { BotaoSeta, BotaoTocar, Selo, SeloFlutuante } from './pecas.jsx';

export default function Hero({ aoVerDemo }) {
  const [prefs] = usePreferencias();
  return (
    <section id="topo" className="hero" aria-labelledby="titulo-hero">
      <div className="largura hero-grade">
        <div className="hero-texto">
          <Selo Icone={IconeCuidadores}>Cuidado da pessoa idosa, em família</Selo>
          <h1 id="titulo-hero">Mais cuidado, <span className="realce">todos os dias</span></h1>
          <p className="hero-sub">
            Remédios, agenda, tarefas e cuidadores em um só lugar, para a família inteira acompanhar e ninguém cuidar sozinho.
          </p>
          <div className="acoes">
            {prefs.perfil
              ? <BotaoSeta href={LINKS.inicio}>Abrir meu Início</BotaoSeta>
              : <BotaoSeta href={LINKS.criar}>Criar conta</BotaoSeta>}
            <BotaoTocar aoClicar={aoVerDemo} titulo="Ver como funciona" />
          </div>
        </div>

        <div className="cena">
          <div className="cena-mancha" aria-hidden="true" />
          <div className="cena-mancha2" aria-hidden="true" />
          <div className="cena-pessoa">
            <img src={foto} width="960" height="1118" fetchPriority="high" alt="Cuidador sorrindo, de uniforme verde-claro, com as mãos no estetoscópio" />
          </div>
          <img className="cena-celular" src={celular} width="560" height="1108" alt="Celular com a tela Início: próximo remédio em 15 minutos e o botão Já tomou" />
          <SeloFlutuante className="flutuante--perfis" Icone={IconePerfis} titulo="3 perfis" texto="idoso, família e cuidador" />
          <SeloFlutuante className="flutuante--toque" Icone={IconeToque} titulo="1 toque" texto="para registrar a dose" />
          <p className="manuscrito">
            A família toda,<br />no mesmo cuidado
            <svg viewBox="0 0 120 12" width="120" height="12" fill="none" aria-hidden="true"><path d="M3 9C32 3 78 1 117 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
          </p>
        </div>
      </div>
    </section>
  );
}
