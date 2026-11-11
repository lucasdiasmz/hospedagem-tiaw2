import CardHead from "./CardHead.jsx";
import { getNomeCurto } from "../../utils/formatadores.js";

function CardSobre({ idoso }) {
  let sobre = <p className="empty">Nenhuma descrição ainda.</p>;
  if (idoso.sobre) {
    sobre = <p className="text-block">{idoso.sobre}</p>;
  }

  let observacoes = null;
  if (idoso.observacoes) {
    observacoes = (
      <p className="note">
        <strong>Para a equipe:</strong> {idoso.observacoes}
      </p>
    );
  }

  return (
    <article className="card card-wide">
      <CardHead icone="file-text" titulo={"Sobre " + getNomeCurto(idoso)} />
      {sobre}
      {observacoes}
    </article>
  );
}

export default CardSobre;
