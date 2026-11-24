import { IconeLapis } from '@ds/Icones.jsx';

function Item({ m, editandoId, aoEditar, aoAlternar }) {
  return (
    <li className={'item-med' + (m.ativo ? '' : ' inativo') + (m.id === editandoId ? ' editando' : '')}>
      <div className="item-horarios" aria-label={'Horários: ' + m.horarios.join(', ')}>
        {m.horarios.map((h) => <time key={h}>{h}</time>)}
      </div>
      <div className="item-texto">
        <strong>{m.nome} <span className="dose">{m.dosagem}</span></strong>
        <small>{m.forma} · {m.via}{m.categoria && ' · ' + m.categoria}</small>
        {m.observacoes && <small className="obs">{m.observacoes}</small>}
      </div>
      <div className="item-acoes">
        <button type="button" className="btn btn-texto" onClick={() => aoEditar(m)} aria-label={'Editar ' + m.nome}>
          <IconeLapis />
          <span>Editar</span>
        </button>
        <button type="button" className="btn btn-texto alternar" onClick={() => aoAlternar(m.id)}>
          {m.ativo ? 'Pausar' : 'Reativar'}
        </button>
      </div>
    </li>
  );
}

export default function ListaMedicamentos({ idoso, medicamentos, carregando, editandoId, aoAlternar, aoEditar, secaoRef }) {
  const nome = idoso.apelido || idoso.nome;
  const ativos = medicamentos.filter((m) => m.ativo);
  const pausados = medicamentos.filter((m) => !m.ativo);

  return (
    <section className="lista" ref={secaoRef} aria-labelledby="lista-titulo">
      <div className="secao-cabeca">
        <h2 id="lista-titulo">Remédios de {nome}</h2>
        {!carregando && <p>{ativos.length} em uso</p>}
      </div>

      {carregando ? (
        <div className="esqueleto lista-esqueleto" aria-hidden="true" />
      ) : medicamentos.length === 0 ? (
        <p className="lista-vazia">Nenhum medicamento cadastrado para {nome}. Use o formulário para cadastrar o primeiro.</p>
      ) : (
        <>
          {ativos.length > 0 && <ul className="itens">{ativos.map((m) => <Item key={m.id} m={m} editandoId={editandoId} aoEditar={aoEditar} aoAlternar={aoAlternar} />)}</ul>}
          {pausados.length > 0 && (
            <>
              <h3 className="lista-sub">Pausados</h3>
              <ul className="itens">{pausados.map((m) => <Item key={m.id} m={m} editandoId={editandoId} aoEditar={aoEditar} aoAlternar={aoAlternar} />)}</ul>
            </>
          )}
        </>
      )}
    </section>
  );
}
