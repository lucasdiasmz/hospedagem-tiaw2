import Icon from "../Icon.jsx";
import ItemRelato from "./ItemRelato.jsx";

function GrupoPeriodo({ grupo, marcandoId, onMarcarVisto }) {
  let contador = grupo.relatos.length + " relatos";
  if (grupo.relatos.length === 1) {
    contador = "1 relato";
  }

  return (
    <section className="periodo" aria-labelledby={"periodo-" + grupo.periodo.id}>
      <h3 className="periodo-titulo" id={"periodo-" + grupo.periodo.id}>
        <Icon name={grupo.periodo.icone} />
        {grupo.periodo.label}
        <span className="count">{contador}</span>
      </h3>
      <ol className="relatos">
        {grupo.relatos.map(function (relato) {
          return (
            <ItemRelato
              key={relato.id}
              relato={relato}
              marcando={marcandoId === relato.id}
              onMarcarVisto={onMarcarVisto}
            />
          );
        })}
      </ol>
    </section>
  );
}

export default GrupoPeriodo;
