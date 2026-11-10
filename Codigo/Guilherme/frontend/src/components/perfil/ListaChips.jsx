function ListaChips({ itens, variante }) {
  if (itens.length === 0) {
    return <p className="empty">Nada registrado.</p>;
  }

  let classe = "chip";
  if (variante === "ajuda") {
    classe = "chip chip-help";
  }

  return (
    <div className="chips">
      {itens.map(function (item) {
        return (
          <span key={item} className={classe}>
            {item}
          </span>
        );
      })}
    </div>
  );
}

export default ListaChips;
