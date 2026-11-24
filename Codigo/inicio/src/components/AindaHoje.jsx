import { useEffect, useRef } from 'react';
import { IconeCheck, IconeFechar } from '@ds/Icones.jsx';
import { ICONES_TIPO, NOMES_TIPO } from './Icones.jsx';

/* o que ainda falta no dia (sem o item em destaque) e as anotações, em ordem de horário */
export default function AindaHoje({ secaoRef, entradas, carregando, novaNotaId, aoConcluir, aoRemoverNota, aoNovaNota }) {
  const listaRef = useRef(null);

  /* rola até a anotação recém-criada */
  useEffect(() => {
    if (novaNotaId == null) return;
    const li = listaRef.current?.querySelector(`[data-id="${novaNotaId}"]`);
    if (li) li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [novaNotaId]);

  return (
    <section className="ainda-hoje" ref={secaoRef} aria-labelledby="ainda-hoje-titulo">
      <div className="secao-cabeca">
        <h2 id="ainda-hoje-titulo">Ainda hoje</h2>
        {aoNovaNota && <button type="button" className="btn btn-texto" onClick={aoNovaNota}>Anotar</button>}
      </div>

      {carregando ? (
        <div className="esqueleto ainda-esqueleto" aria-hidden="true" />
      ) : !entradas.length ? (
        <p className="ainda-vazio">Nada mais para hoje.{aoNovaNota && ' Use “Anotar” para registrar algo do dia.'}</p>
      ) : (
        <ol className="ainda-lista" ref={listaRef}>
          {entradas.map((e) => {
            const nota = e.tipo === 'nota';
            return (
              <li key={(nota ? 'nota-' : '') + e.id} className={'ainda-item tipo-' + e.tipo} data-id={e.id}>
                <time className="ainda-hora">{e.hora}</time>
                <span className="ainda-icone" aria-hidden="true">{ICONES_TIPO[e.tipo]}</span>
                <span className="ainda-texto">
                  <strong>{nota ? e.texto : e.titulo}</strong>
                  <small>{nota ? NOMES_TIPO.nota : e.detalhe || NOMES_TIPO[e.tipo]}</small>
                </span>
                {nota ? aoRemoverNota && (
                  <button type="button" className="btn-icone" aria-label={'Remover anotação: ' + e.texto} onClick={() => aoRemoverNota(e.id)}>
                    <IconeFechar />
                  </button>
                ) : (
                  <button type="button" className="ainda-feito" aria-label={'Marcar como feito: ' + e.titulo} onClick={() => aoConcluir(e.id)}>
                    <IconeCheck />
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
