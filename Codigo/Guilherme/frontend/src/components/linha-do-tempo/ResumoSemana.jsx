import Icon from "../Icon.jsx";
import { getTipo } from "../../data/relatos.js";
import { formatarDataCurta } from "../../utils/datas.js";

function ResumoSemana({ resumo, carregando }) {
  let conteudo = null;
  let periodo = "Últimos 7 dias";

  if (carregando) {
    conteudo = <p className="empty">Calculando o resumo...</p>;
  } else if (!resumo) {
    conteudo = <p className="empty">Resumo indisponível no momento.</p>;
  } else {
    let textoRelatos = resumo.totalRelatos + " relatos";
    if (resumo.totalRelatos === 1) {
      textoRelatos = "1 relato";
    }
    periodo = formatarDataCurta(resumo.inicio) + " a " + formatarDataCurta(resumo.fim) + " · " + textoRelatos;

    if (resumo.pontosAtencao.length === 0) {
      conteudo = (
        <p className="resumo-tranquilo">
          <Icon name="check" />
          Semana tranquila: nenhum alerta registrado.
        </p>
      );
    } else {
      conteudo = (
        <ul className="pontos-semana">
          {resumo.pontosAtencao.map(function (ponto) {
            const tipo = getTipo(ponto.tipo);

            let classeItem = tipo.classe;
            if (ponto.urgentes > 0) {
              classeItem = classeItem + " ponto-urgente";
            }

            return (
              <li key={ponto.tipo} className={classeItem}>
                <span className="ponto-icone">
                  <Icon name={tipo.icone} />
                </span>
                <span className="ponto-texto">{ponto.texto}</span>
                <span className="ponto-qtd">{ponto.quantidade}x</span>
              </li>
            );
          })}
        </ul>
      );
    }
  }

  return (
    <section className="card resumo-semana" aria-label="Resumo da semana">
      <div className="card-head">
        <span className="card-icon">
          <Icon name="chart" />
        </span>
        <div>
          <h2 className="card-titulo">Resumo da semana</h2>
          <small className="card-sub">{periodo}</small>
        </div>
      </div>
      {conteudo}
    </section>
  );
}

export default ResumoSemana;
