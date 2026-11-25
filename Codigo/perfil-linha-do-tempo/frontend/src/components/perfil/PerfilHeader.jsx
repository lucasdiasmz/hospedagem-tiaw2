import SeletorIdoso from "../SeletorIdoso.jsx";

function PerfilHeader({ idosos, idosoAtual, onTrocarIdoso }) {
  return (
    <div className="page-head">
      <div>
        <h1>Perfil do idoso</h1>
        <p className="subtitle">Tudo o que a equipe precisa saber sobre quem você cuida.</p>
      </div>
      <SeletorIdoso idosos={idosos} idosoAtualId={idosoAtual.id} onTrocar={onTrocarIdoso} />
    </div>
  );
}

export default PerfilHeader;
