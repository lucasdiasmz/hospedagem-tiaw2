import CardHead from "./CardHead.jsx";
import { getIniciais } from "../../utils/formatadores.js";

function CardEquipe({ cuidadores }) {
  let conteudo = null;

  if (cuidadores.length === 0) {
    conteudo = <p className="empty">Nenhum cuidador vinculado.</p>;
  } else {
    conteudo = (
      <div className="team">
        {cuidadores.map(function (cuidador) {
          return (
            <div key={cuidador.nome} className="list-item">
              <span className="avatar">{getIniciais(cuidador.nome)}</span>
              <div className="grow">
                <strong>{cuidador.nome}</strong>
                <small>
                  {cuidador.funcao} · {cuidador.turno}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <article className="card card-wide">
      <CardHead icone="users" titulo="Equipe de cuidado" extra={cuidadores.length + " pessoas"} />
      {conteudo}
    </article>
  );
}

export default CardEquipe;
