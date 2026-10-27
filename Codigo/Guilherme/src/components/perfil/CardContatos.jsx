import CardHead from "./CardHead.jsx";
import Icon from "../Icon.jsx";
import { getIniciais, getTelLink } from "../../utils/formatadores.js";

function CardContatos({ contatos }) {
  let conteudo = null;

  if (contatos.length === 0) {
    conteudo = <p className="empty">Nenhum contato de emergência.</p>;
  } else {
    conteudo = (
      <ul className="list">
        {contatos.map(function (contato) {
          let badge = null;
          if (contato.principal) {
            badge = <span className="badge-principal">Principal</span>;
          }

          return (
            <li key={contato.nome} className="list-item">
              <span className="avatar">{getIniciais(contato.nome)}</span>
              <div className="grow">
                <strong>{contato.nome}</strong>
                {badge}
                <small>
                  {contato.parentesco} · {contato.telefone}
                </small>
              </div>
              <a className="call-btn" href={getTelLink(contato.telefone)} aria-label={"Ligar para " + contato.nome}>
                <Icon name="phone" />
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <article className="card">
      <CardHead icone="phone" titulo="Contatos de emergência" />
      {conteudo}
    </article>
  );
}

export default CardContatos;
