import Icon from "../Icon.jsx";
import {
  calcularIdade,
  formatarData,
  getIniciais,
  getPrimeiroNome,
  getTelLink,
  getContatoPrincipal
} from "../../utils/formatadores.js";

function HeroIdoso({ idoso, onEditar }) {
  const idade = calcularIdade(idoso.dataNascimento);
  const contatoPrincipal = getContatoPrincipal(idoso);

  let botaoLigar = null;
  if (contatoPrincipal) {
    botaoLigar = (
      <a className="btn btn-light" href={getTelLink(contatoPrincipal.telefone)}>
        <Icon name="phone" />
        Ligar para {getPrimeiroNome(contatoPrincipal.nome)}
      </a>
    );
  }

  let apelidoTexto = "";
  if (idoso.apelido) {
    apelidoTexto = "“" + idoso.apelido + "” · ";
  }

  return (
    <section className="hero" aria-labelledby="nomeIdoso">
      <div className="avatar avatar-xl" aria-hidden="true">
        {getIniciais(idoso.nome)}
      </div>
      <div className="hero-info">
        <span className="eyebrow">Idoso(a) acompanhado(a)</span>
        <h2 id="nomeIdoso">{idoso.nome}</h2>
        <p className="hero-meta">
          {apelidoTexto}
          {idade} anos · Nasc. {formatarData(idoso.dataNascimento)}
        </p>
        <div className="tags">
          <span className="tag">
            <Icon name="accessibility" />
            Mobilidade {idoso.mobilidade.nivel.toLowerCase()}
          </span>
          <span className="tag">
            <Icon name="droplet" />
            Sangue {idoso.tipoSanguineo}
          </span>
        </div>
      </div>
      <div className="hero-actions">
        {botaoLigar}
        <button type="button" className="btn btn-ghost-light" onClick={onEditar}>
          <Icon name="edit" />
          Editar perfil
        </button>
      </div>
    </section>
  );
}

export default HeroIdoso;
