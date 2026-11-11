import CardHead from "./CardHead.jsx";

function CardSaude({ condicoes }) {
  let conteudo = null;

  if (condicoes.length === 0) {
    conteudo = <p className="empty">Nenhuma condição registrada.</p>;
  } else {
    conteudo = (
      <ul className="list">
        {condicoes.map(function (condicao) {
          return (
            <li key={condicao} className="list-item">
              <span className="bullet"></span>
              <strong>{condicao}</strong>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <article className="card">
      <CardHead icone="heart" titulo="Condições de saúde" />
      {conteudo}
    </article>
  );
}

export default CardSaude;
