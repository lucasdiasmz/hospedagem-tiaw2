import { useEffect, useRef } from 'react';
import { IconeMais } from './Icones.jsx';

function rotuloDoItem(item) {
  if (item.status === 'tomei') return item.tipo === 'med' ? 'Tomei' : 'Concluído';
  if (item.status === 'recusou') return 'Recusou';
  return item.detalhe;
}

export default function Timeline({ secaoRef, entradas, proximoId, busca, novaNotaId, aoAlternar, aoRemoverNota, aoAbrirNota }) {
  const listaRef = useRef(null);
  const q = busca.trim().toLowerCase();

  /* ao abrir a página, mostra o item atual da linha do tempo */
  useEffect(() => {
    const lista = listaRef.current;
    const foco = lista.querySelector('.proximo');
    if (foco) {
      lista.scrollTop = foco.getBoundingClientRect().top - lista.getBoundingClientRect().top + lista.scrollTop - 8;
    }
  }, []);

  /* rola até a anotação recém-criada */
  useEffect(() => {
    if (novaNotaId == null) return;
    const li = listaRef.current.querySelector(`[data-id="${novaNotaId}"]`);
    if (li) li.scrollIntoView({ block: 'nearest' });
  }, [novaNotaId]);

  return (
    <section className="card card-timeline" ref={secaoRef}>
      <div className="timeline-topo">
        <h2>Linha do tempo de hoje</h2>
        <button className="nova-nota" type="button" onClick={aoAbrirNota}>
          <IconeMais width="16" height="16" strokeWidth="2.6" />
          Anotação
        </button>
      </div>
      <ul className="timeline" ref={listaRef}>
        {entradas.map((e) => {
          if (e.tipo === 'nota') {
            const oculto = !!q && !`${e.hora}${e.texto} Anotação`.toLowerCase().includes(q);
            return (
              <li key={'nota-' + e.id} className="nota" data-id={e.id} hidden={oculto}>
                <span className="ponto"></span>
                <span className="hora-item">{e.hora}</span>
                <span className="desc" title={e.texto}>{e.texto} <em>Anotação</em></span>
                <button type="button" className="nota-remover" aria-label="Remover anotação" onClick={() => aoRemoverNota(e.id)}>×</button>
              </li>
            );
          }

          const rotulo = rotuloDoItem(e);
          const feito = e.status === 'tomei';
          const classes = [feito && 'feito', e.status === 'recusou' && 'recusado', e.id === proximoId && 'proximo']
            .filter(Boolean).join(' ');
          const oculto = !!q && !`${e.hora}${e.titulo} ${rotulo}`.toLowerCase().includes(q);

          return (
            <li key={e.id} className={classes || undefined} data-id={e.id} hidden={oculto}>
              <button
                type="button"
                className="ponto"
                aria-label="Marcar como concluído"
                aria-pressed={feito}
                onClick={() => aoAlternar(e.id)}
              ></button>
              <span className="hora-item">{e.hora}</span>
              <span className="desc">{e.titulo} <em>{rotulo}</em></span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
