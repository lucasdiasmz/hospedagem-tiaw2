import { useEffect, useRef } from 'react';
import { IconeCheck } from './Icones.jsx';

/* o que ainda falta no dia (sem o item em destaque) e as anotações, em ordem de horário */
export default function AindaHoje({ secaoRef, entradas, busca, novaNotaId, aoConcluir, aoRemoverNota }) {
  const listaRef = useRef(null);
  const q = busca.trim().toLowerCase();

  const visiveis = entradas.filter((e) => {
    if (!q) return true;
    const texto = e.tipo === 'nota' ? `${e.hora} ${e.texto} Anotação` : `${e.hora} ${e.titulo} ${e.detalhe}`;
    return texto.toLowerCase().includes(q);
  });

  /* rola até a anotação recém-criada */
  useEffect(() => {
    if (novaNotaId == null) return;
    const li = listaRef.current?.querySelector(`[data-id="${novaNotaId}"]`);
    if (li) li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [novaNotaId]);

  let vazio = null;
  if (!entradas.length) vazio = 'Nada mais para hoje.';
  else if (!visiveis.length) vazio = 'Nenhum resultado para "' + busca.trim() + '".';

  return (
    <section className="card ainda-hoje" ref={secaoRef} aria-labelledby="ainda-hoje-titulo">
      <h2 id="ainda-hoje-titulo">Ainda hoje</h2>

      {vazio ? (
        <p className="ainda-vazio">{vazio}</p>
      ) : (
        <ul className="ainda-lista" ref={listaRef}>
          {visiveis.map((e) =>
            e.tipo === 'nota' ? (
              <li key={'nota-' + e.id} className="ainda-item nota" data-id={e.id}>
                <span className="ainda-hora">{e.hora}</span>
                <span className="ainda-titulo" title={e.texto}>{e.texto}</span>
                <span className="ainda-detalhe">Anotação</span>
                <button type="button" className="ainda-botao" aria-label="Remover anotação" onClick={() => aoRemoverNota(e.id)}>×</button>
              </li>
            ) : (
              <li key={e.id} className="ainda-item" data-id={e.id}>
                <span className="ainda-hora">{e.hora}</span>
                <span className="ainda-titulo">{e.titulo}</span>
                <span className="ainda-detalhe">{e.detalhe}</span>
                <button type="button" className="ainda-botao" aria-label={'Marcar como feito: ' + e.titulo} onClick={() => aoConcluir(e.id)}>
                  <IconeCheck />
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}
