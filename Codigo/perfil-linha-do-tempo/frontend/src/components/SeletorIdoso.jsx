import { getIniciais, getNomeCurto } from "../utils/formatadores.js";

function SeletorIdoso({ idosos, idosoAtualId, onTrocar }) {
  if (idosos.length <= 1) {
    return null;
  }

  return (
    <div className="switcher" role="group" aria-label="Trocar idoso">
      {idosos.map(function (item) {
        let selecionado = false;
        if (item.id === idosoAtualId) {
          selecionado = true;
        }

        return (
          <button
            key={item.id}
            type="button"
            className="switch-chip"
            aria-pressed={selecionado}
            onClick={function () {
              onTrocar(item.id);
            }}
          >
            <span className="avatar">{getIniciais(item.nome)}</span>
            {getNomeCurto(item)}
          </button>
        );
      })}
    </div>
  );
}

export default SeletorIdoso;
