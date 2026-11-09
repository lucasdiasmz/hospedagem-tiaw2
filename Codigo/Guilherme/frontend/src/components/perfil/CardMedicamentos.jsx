import CardHead from "./CardHead.jsx";
import { ordenarPorHorario } from "../../utils/formatadores.js";

function CardMedicamentos({ medicamentos }) {
  const ordenados = ordenarPorHorario(medicamentos);
  let conteudo = null;

  if (ordenados.length === 0) {
    conteudo = <p className="empty">Nenhum medicamento em uso.</p>;
  } else {
    conteudo = (
      <ul className="list">
        {ordenados.map(function (med) {
          return (
            <li key={med.nome + med.horario} className="list-item">
              <span className="time">{med.horario}</span>
              <div className="grow">
                <strong>{med.nome}</strong>
                <small>{med.dose}</small>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <article className="card">
      <CardHead icone="pill" titulo="Medicamentos em uso" extra={ordenados.length + " ativos"} />
      {conteudo}
    </article>
  );
}

export default CardMedicamentos;
