import Icon from "../Icon.jsx";
import SeletorIdoso from "../SeletorIdoso.jsx";

function PerfilHeader({ idosos, idosoAtual, onTrocarIdoso }) {
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
      <SeletorIdoso idosos={idosos} idosoAtualId={idosoAtual.id} onTrocar={onTrocarIdoso} />
    </div>
  );
}

export default PerfilHeader;
