import Icon from "../Icon.jsx";
import { formatarHora } from "../../utils/datas.js";

function Indicador({ icone, valor, rotulo, variante }) {
  return (
    <div className={"indicador indicador-" + variante}>
      <span className="indicador-icone">
        <Icon name={icone} />
      </span>
      <strong>{valor}</strong>
      <small>{rotulo}</small>
    </div>
  );
}

function ResumoDia({ relatos, carregando }) {
  let total = "–";
  let urgentes = "–";
  let atencao = "–";
  let naoVistos = "–";
  let listaUrgentes = null;

  if (!carregando) {
    const relatosUrgentes = relatos.filter(function (relato) {
      return relato.nivel === "Urgente";
    });

    total = relatos.length;
    urgentes = relatosUrgentes.length;
    atencao = relatos.filter(function (relato) {
      return relato.nivel === "Atencao";
    }).length;
    naoVistos = relatos.filter(function (relato) {
      return !relato.visto;
    }).length;

    if (relatosUrgentes.length > 0) {
      listaUrgentes = (
        <ul className="lista-urgentes" aria-label="Relatos urgentes do dia">
          {relatosUrgentes.map(function (relato) {
            return (
              <li key={relato.id}>
                <Icon name="alert" />
                <span>
                  <strong>{formatarHora(relato.dataHora)} · {relato.tipo}</strong>
                  {relato.descricao}
                </span>
              </li>
            );
          })}
        </ul>
      );
    }
  }

  return (
    <section className="card resumo-dia" aria-label="Resumo do dia">
      <h2 className="card-titulo">Resumo do dia</h2>
      <div className="indicadores">
        <Indicador icone="message" valor={total} rotulo="Relatos" variante="padrao" />
        <Indicador icone="alert" valor={urgentes} rotulo="Urgentes" variante="urgente" />
        <Indicador icone="alert" valor={atencao} rotulo="Atenção" variante="atencao" />
        <Indicador icone="eye" valor={naoVistos} rotulo="Não vistos" variante="novo" />
      </div>
      {listaUrgentes}
    </section>
  );
}

export default ResumoDia;
