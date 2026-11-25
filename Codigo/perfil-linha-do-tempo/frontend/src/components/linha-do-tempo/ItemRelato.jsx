import Icon from "../Icon.jsx";
import { getTipo, getNivel, getRotuloPapel } from "../../data/relatos.js";
import { formatarHora } from "../../utils/datas.js";
import { getRotuloAutor } from "../../utils/relatos.js";

function ItemRelato({ relato, marcando, onMarcarVisto }) {
  const tipo = getTipo(relato.tipo);
  const nivel = getNivel(relato.nivel);

  let classe = "relato " + tipo.classe;
  if (relato.nivel === "Urgente") {
    classe = classe + " relato-urgente";
  } else if (relato.nivel === "Atencao") {
    classe = classe + " relato-atencao";
  }
  if (!relato.visto) {
    classe = classe + " relato-novo";
  }

  let seloNovo = null;
  if (!relato.visto) {
    seloNovo = <span className="selo selo-novo">Novo</span>;
  }

  let acao = null;
  if (!relato.visto && onMarcarVisto) {
    let texto = "Marcar como visto";
    if (marcando) {
      texto = "Marcando...";
    }

    acao = (
      <button
        type="button"
        className="btn-link"
        disabled={marcando}
        onClick={function () {
          onMarcarVisto(relato);
        }}
      >
        <Icon name="eye" />
        {texto}
      </button>
    );
  }

  return (
    <li className={classe}>
      <span className="relato-marcador" aria-hidden="true">
        <Icon name={tipo.icone} />
      </span>
      <article className="relato-corpo">
        <div className="relato-topo">
          <time className="relato-hora" dateTime={relato.dataHora}>
            {formatarHora(relato.dataHora)}
          </time>
          <span className="relato-tipo">{relato.tipo}</span>
          <span className="relato-selos">
            <span className={"selo " + nivel.classe}>
              <Icon name={nivel.icone} />
              {nivel.label}
            </span>
            {seloNovo}
          </span>
        </div>
        <p className="relato-texto">{relato.descricao}</p>
        <div className="relato-rodape">
          <p className="relato-autor">
            Registrado por <strong>{getRotuloAutor(relato.registradoPor)}</strong>
            <span> · {getRotuloPapel(relato.registradoPor.papel)}</span>
          </p>
          {acao}
        </div>
      </article>
    </li>
  );
}

export default ItemRelato;
