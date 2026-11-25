import { usePreferencias } from '@ds/preferencias.js';
import logo from '@ds/assets/logo-acessamob-claro.png';
import { LINKS } from '../conteudo.js';
import { BotaoSeta } from './pecas.jsx';

export default function Chamada() {
  const [prefs] = usePreferencias();
  return (
    <section className="largura" aria-labelledby="titulo-chamada">
      <div className="chamada sobre-escuro">
        <div className="chamada-marca">
          <img src={logo} alt="" width="64" height="64" />
          <h2 id="titulo-chamada">Comece pela rotina de hoje</h2>
        </div>
        <p>Crie a conta, cadastre quem recebe o cuidado e convide a família com um código.</p>
        {prefs.perfil
          ? <BotaoSeta href={LINKS.inicio} className="btn-claro">Abrir meu Início</BotaoSeta>
          : <BotaoSeta href={LINKS.criar} className="btn-claro">Criar conta</BotaoSeta>}
      </div>
    </section>
  );
}
