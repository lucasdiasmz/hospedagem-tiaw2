import CardHead from "./CardHead.jsx";
import { ordenarPorHorario } from "../../utils/formatadores.js";

function CardRotina({ rotina }) {
  const ordenada = ordenarPorHorario(rotina);
  let conteudo = null;

  if (ordenada.length === 0) {
    conteudo = <p className="empty">Nenhuma rotina cadastrada.</p>;
  } else {
    conteudo = (
      <ul className="list">
        {ordenada.map(function (item) {
          return (
            <li key={item.horario + item.atividade} className="list-item">
              <span className="time">{item.horario}</span>
              <div className="grow">
                <strong>{item.atividade}</strong>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <article className="card">
      <CardHead icone="clock" titulo="Rotina do dia" />
      {conteudo}
    </article>
  );
}

export default CardRotina;
