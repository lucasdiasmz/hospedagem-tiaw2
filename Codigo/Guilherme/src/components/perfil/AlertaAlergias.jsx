import Icon from "../Icon.jsx";

function AlertaAlergias({ alergias }) {
  if (alergias.length > 0) {
    return (
      <section className="alert alert-danger" role="note">
        <Icon name="alert" />
        <div>
          <strong>Atenção: alergias</strong>
          <p>{alergias.join(", ")}</p>
        </div>
      </section>
    );
  } else {
    return (
      <section className="alert alert-ok" role="note">
        <Icon name="check" />
        <div>
          <strong>Nenhuma alergia registrada</strong>
        </div>
      </section>
    );
  }
}

export default AlertaAlergias;
