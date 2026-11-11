import Icon from "../Icon.jsx";

function Stat({ icone, rotulo, valor }) {
  return (
    <div className="stat">
      <span className="stat-icon">
        <Icon name={icone} />
      </span>
      <div>
        <small>{rotulo}</small>
        <strong>{valor}</strong>
      </div>
    </div>
  );
}

function ResumoStats({ idoso }) {
  let cuidadorPrincipal = "Não definido";
  if (idoso.cuidadores.length > 0) {
    cuidadorPrincipal = idoso.cuidadores[0].nome;
  }

  let textoRemedios = "";
  if (idoso.medicamentos.length === 1) {
    textoRemedios = "1 por dia";
  } else {
    textoRemedios = idoso.medicamentos.length + " por dia";
  }

  return (
    <section className="stats" aria-label="Resumo">
      <Stat icone="accessibility" rotulo="Mobilidade" valor={idoso.mobilidade.nivel} />
      <Stat icone="pill" rotulo="Medicamentos" valor={textoRemedios} />
      <Stat icone="user" rotulo="Cuidador(a) principal" valor={cuidadorPrincipal} />
    </section>
  );
}

export default ResumoStats;
