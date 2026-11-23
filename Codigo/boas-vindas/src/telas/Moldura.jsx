import logo from '../assets/logo-acessamob.png';

/* painel azul com a marca à esquerda (o mesmo azul do menu lateral das outras telas)
   e o conteúdo da etapa à direita */
function Moldura({ etapa, children }) {
  return (
    <div className="moldura">
      <aside className="painel-marca">
        <div className="marca">
          <img src={logo} alt="" width="52" height="52" />
          <div>
            <span className="marca-nome">AcessaMob</span>
            <small>Mais cuidado, todos os dias.</small>
          </div>
        </div>

        <div className="painel-texto">
          <p className="painel-etapa">{etapa}</p>
          <p className="painel-frase">Cuidado organizado para quem cuida e para quem é cuidado.</p>
        </div>

        <svg className="ondas" viewBox="0 0 313 150" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 70C50 20 110 10 170 40s100 30 143-10v120H0z" fill="rgba(70,130,255,.12)" />
          <path d="M0 100C60 60 120 70 190 90s90 0 123-20v80H0z" fill="rgba(70,130,255,.1)" />
        </svg>
        <p className="versao">AcessaMob v1.0.0</p>
      </aside>

      <div className="area">{children}</div>
    </div>
  );
}

export default Moldura;
