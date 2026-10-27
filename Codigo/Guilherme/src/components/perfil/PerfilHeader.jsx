import Icon from "../Icon.jsx";
import { getIniciais, getNomeCurto } from "../../utils/formatadores.js";

function PerfilHeader({ idosos, idosoAtual, onTrocarIdoso }) {
  let switcher = null;

  if (idosos.length > 1) {
    switcher = (
      <div className="switcher" aria-label="Trocar idoso">
        {idosos.map(function (item) {
          let selecionado = false;
          if (item.id === idosoAtual.id) {
            selecionado = true;
          }

          return (
            <button
              key={item.id}
              type="button"
              className="switch-chip"
              aria-pressed={selecionado}
              onClick={function () {
                onTrocarIdoso(item.id);
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

  return (
    <div className="page-head">
      <div>
        <nav className="breadcrumb" aria-label="Você está em">
          <a href="#">Perfis</a>
          <Icon name="chevron-right" />
          <span>{idosoAtual.nome}</span>
        </nav>
        <h1>Perfil do idoso</h1>
        <p className="subtitle">Tudo o que a equipe precisa saber sobre quem você cuida.</p>
      </div>
      {switcher}
    </div>
  );
}

export default PerfilHeader;
