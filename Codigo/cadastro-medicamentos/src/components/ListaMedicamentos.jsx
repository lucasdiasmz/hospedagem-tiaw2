export default function ListaMedicamentos({ idoso, medicamentos, carregando, aoAlternar, secaoRef }) {
  return (
    <section className="lista card" ref={secaoRef} aria-labelledby="lista-titulo">
      <h2 id="lista-titulo">Medicamentos de {idoso.apelido}</h2>

      {carregando ? (
        <p className="vazio">Carregando...</p>
      ) : medicamentos.length === 0 ? (
        <p className="vazio">Nenhum medicamento cadastrado para {idoso.apelido}.</p>
      ) : (
        <ul>
          {medicamentos.map((m) => (
            <li key={m.id} className={'item-med' + (m.ativo ? '' : ' inativo')}>
              <div className="item-horarios">
                {m.horarios.map((h) => <span key={h}>{h}</span>)}
              </div>
              <div className="item-texto">
                <strong>
                  {m.nome} <span className="dose">{m.dosagem}</span>
                  {!m.ativo && <span className="selo">Inativo</span>}
                </strong>
                <small>{m.forma} · {m.via}{m.categoria && ' · ' + m.categoria}</small>
                {m.observacoes && <small className="obs">{m.observacoes}</small>}
              </div>
              <button type="button" className="alternar" onClick={() => aoAlternar(m.id)}>
                {m.ativo ? 'Desativar' : 'Reativar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
