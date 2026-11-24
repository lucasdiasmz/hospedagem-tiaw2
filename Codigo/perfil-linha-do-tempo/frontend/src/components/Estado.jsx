import Icon from "./Icon.jsx";

export function EstadoCarregando({ texto }) {
  return (
    <div className="estado" role="status">
      <span className="spinner" aria-hidden="true"></span>
      <p>{texto}</p>
    </div>
  );
}

export function EstadoErro({ titulo, mensagem, onTentarDeNovo }) {
  return (
    <div className="estado estado-erro" role="alert">
      <Icon name="alert" />
      <strong>{titulo}</strong>
      <p>{mensagem}</p>
      <button type="button" className="btn btn-primario" onClick={onTentarDeNovo}>
        Tentar de novo
      </button>
    </div>
  );
}

export function EstadoVazio({ icone, titulo, texto }) {
  return (
    <div className="estado">
      <Icon name={icone} />
      <strong>{titulo}</strong>
      <p>{texto}</p>
    </div>
  );
}
