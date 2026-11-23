import Icon from "../Icon.jsx";
import { formatarDataLonga, getRotuloDia, somarDias } from "../../utils/datas.js";

function NavegadorData({ data, hoje, onMudarData }) {
  const ehHoje = data === hoje;

  function handleEscolherData(evento) {
    const valor = evento.target.value;
    if (valor && valor <= hoje) {
      onMudarData(valor);
    }
  }

  return (
    <div className="navegador-data">
      <button
        type="button"
        className="btn-icone nav-dia"
        aria-label="Dia anterior"
        onClick={function () {
          onMudarData(somarDias(data, -1));
        }}
      >
        <Icon name="chevron-left" />
      </button>

      <div className="navegador-texto" aria-live="polite">
        <strong>{getRotuloDia(data, hoje)}</strong>
        <span>{formatarDataLonga(data)}</span>
      </div>

      <button
        type="button"
        className="btn-icone nav-dia"
        aria-label="Próximo dia"
        disabled={ehHoje}
        onClick={function () {
          onMudarData(somarDias(data, 1));
        }}
      >
        <Icon name="chevron-right" />
      </button>

      <div className="navegador-acoes">
        <label className="somente-leitor" htmlFor="escolherData">Escolher data</label>
        <input id="escolherData" type="date" className="input-data" value={data} max={hoje} onChange={handleEscolherData} />
        <button
          type="button"
          className="btn"
          disabled={ehHoje}
          onClick={function () {
            onMudarData(hoje);
          }}
        >
          Hoje
        </button>
      </div>
    </div>
  );
}

export default NavegadorData;
