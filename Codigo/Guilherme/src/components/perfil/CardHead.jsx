import Icon from "../Icon.jsx";

function CardHead({ icone, titulo, extra }) {
  let extraElemento = null;
  if (extra) {
    extraElemento = <span className="count">{extra}</span>;
  }

  return (
    <div className="card-head">
      <span className="card-icon">
        <Icon name={icone} />
      </span>
      <h3>{titulo}</h3>
      {extraElemento}
    </div>
  );
}

export default CardHead;
