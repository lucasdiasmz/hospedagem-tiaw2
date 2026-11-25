import { useEffect, useState } from 'react';
import { IconeBarras, IconeContraste, IconeFechar, IconeLetra } from '@ds/Icones.jsx';
import { usePreferencias } from '@ds/preferencias.js';
import logo from '@ds/assets/logo-acessamob.png';
import { LINKS, MENU } from '../conteudo.js';
import { BotaoSeta } from './pecas.jsx';

/* qual seção está na tela, para sublinhar o item do menu */
function useSecaoAtual() {
  const [atual, setAtual] = useState(MENU[0].id);
  useEffect(() => {
    function conferir() {
      const linha = window.innerHeight * 0.35;
      const passou = MENU.filter(({ id }) => document.getElementById(id)?.getBoundingClientRect().top <= linha);
      setAtual((passou.at(-1) || MENU[0]).id);
    }
    conferir();
    window.addEventListener('scroll', conferir, { passive: true });
    window.addEventListener('resize', conferir);
    return () => {
      window.removeEventListener('scroll', conferir);
      window.removeEventListener('resize', conferir);
    };
  }, []);
  return atual;
}

const AJUSTES = [
  { id: 'fonteMaior', rotulo: 'Letra maior', Icone: IconeLetra },
  { id: 'altoContraste', rotulo: 'Alto contraste', Icone: IconeContraste },
];

export default function Topo() {
  const [aberto, setAberto] = useState(false);
  const [prefs, salvar] = usePreferencias();
  const atual = useSecaoAtual();

  useEffect(() => {
    if (!aberto) return undefined;
    const fechar = (e) => { if (e.key === 'Escape') setAberto(false); };
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aberto]);

  const acao = prefs.perfil
    ? <BotaoSeta href={LINKS.inicio} className="btn-primario barra-acao">Meu Início</BotaoSeta>
    : <BotaoSeta href={LINKS.criar} className="btn-primario barra-acao">Criar conta</BotaoSeta>;

  return (
    <header className={'barra' + (aberto ? ' barra--aberta' : '')}>
      <div className="largura barra-linha">
        <a className="barra-marca" href="#topo" aria-label="AcessaMob, ir para o começo">
          <img src={logo} alt="" width="44" height="44" />
          <span>AcessaMob</span>
        </a>

        <button type="button" className="btn-icone barra-menu" aria-expanded={aberto} aria-controls="menu-site" onClick={() => setAberto(!aberto)}>
          {aberto ? <IconeFechar /> : <IconeBarras />}
          <span className="somente-leitor">Menu</span>
        </button>

        <div id="menu-site" className="barra-painel">
          <nav className="barra-nav" aria-label="Seções da página">
            {MENU.map(({ id, rotulo }) => (
              <a key={id} href={'#' + id} aria-current={id === atual ? 'true' : undefined} onClick={() => setAberto(false)}>{rotulo}</a>
            ))}
          </nav>
          <div className="barra-ajustes" role="group" aria-label="Acessibilidade">
            {AJUSTES.map(({ id, rotulo, Icone }) => (
              <button key={id} type="button" className="ajuste" aria-pressed={Boolean(prefs[id])} title={rotulo} onClick={() => salvar({ [id]: !prefs[id] })}>
                <Icone tamanho={22} />
                <span>{rotulo}</span>
              </button>
            ))}
          </div>
          {!prefs.perfil && <a className="barra-entrar" href={LINKS.entrar}>Entrar</a>}
          {acao}
        </div>

        {acao}
      </div>
    </header>
  );
}
