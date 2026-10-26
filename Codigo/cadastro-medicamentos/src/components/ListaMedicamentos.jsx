import { IconeLixeira } from './Icones.jsx';

export default function ListaMedicamentos({ medicamentos, aoRemover, secaoRef }) {
  return (
    <section className="lista card" ref={secaoRef} aria-labelledby="lista-titulo">
      <h2 id="lista-titulo">Medicamentos cadastrados</h2>

      {medicamentos.length === 0 ? (
        <p className="vazio">Nenhum medicamento cadastrado ainda.</p>
      ) : (
        <ul>
          {medicamentos.map((m) => (
            <li key={m.id} className="item-med">
              <div className="item-horarios">
                {m.horarios.map((h) => <span key={h}>{h}</span>)}
              </div>
              <div className="item-texto">
                <strong>{m.nome} <span className="dose">{m.dosagem}</span></strong>
                <small>{m.forma}</small>
                {m.observacoes && <small className="obs">{m.observacoes}</small>}
              </div>
              <button
                type="button"
                className="remover"
                onClick={() => aoRemover(m.id)}
                aria-label={'Remover ' + m.nome}
              >
                <IconeLixeira />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
