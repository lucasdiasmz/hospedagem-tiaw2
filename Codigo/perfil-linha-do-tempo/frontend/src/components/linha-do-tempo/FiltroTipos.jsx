import Icon from "../Icon.jsx";
import { TIPOS } from "../../data/relatos.js";

function FiltroTipos({ relatos, filtroAtual, onFiltrar }) {
  function contar(tipo) {
    if (tipo === "todos") {
      return relatos.length;
    } else {
      return relatos.filter(function (relato) {
        return relato.tipo === tipo;
      }).length;
    }
  }

  function getRotulo(id) {
    if (id === "todos") {
      return "Todos";
    } else {
      return id;
    }
  }

  const opcoes = [{ id: "todos", icone: null, classe: "" }].concat(TIPOS);

  return (
    <div className="chips-filtro" role="group" aria-label="Filtrar por tipo de relato">
      {opcoes.map(function (opcao) {
        let selecionado = false;
        if (opcao.id === filtroAtual) {
          selecionado = true;
        }

        let icone = null;
        if (opcao.icone) {
          icone = <Icon name={opcao.icone} />;
        }

        return (
          <button
            key={opcao.id}
            type="button"
            className={"chip-filtro " + opcao.classe}
            aria-pressed={selecionado}
            onClick={function () {
              onFiltrar(opcao.id);
            }}
          >
            {icone}
            {getRotulo(opcao.id)}
            <span className="chip-contador">{contar(opcao.id)}</span>
          </button>
        );
      })}
    </div>
  );
}

export default FiltroTipos;
