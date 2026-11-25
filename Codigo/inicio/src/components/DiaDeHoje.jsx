import { useEffect, useRef } from 'react';
import { ReguaDoDia } from '@ds/Componentes.jsx';
import { TELAS } from '@ds/navegacao.js';
import { IconeCheck, IconeFechar } from '@ds/Icones.jsx';
import { ICONES_TIPO, NOMES_TIPO } from './Icones.jsx';

const SITUACAO = { feito: 'Feito', recusou: 'Recusou', atrasado: 'Atrasado' };

/* o dia inteiro em ordem de horário: o que já foi feito, o que está atrasado, o que vem
   e as anotações. A régua em cima resume o dia num olhar. */
export default function DiaDeHoje({ entradas, agora, proximoId, carregando, novaNotaId, podeAgenda, aoConcluir, aoRemoverNota }) {
  const listaRef = useRef(null);

  /* rola até a anotação recém-criada */
  useEffect(() => {
    if (novaNotaId == null) return;
    const li = listaRef.current?.querySelector(`[data-id="${novaNotaId}"]`);
    if (li) li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [novaNotaId]);

  const itens = entradas.map((e) => ({
    ...e,
    situacao: e.status || (e.tipo !== 'nota' && e.hora < agora ? 'atrasado' : null),
  }));

  return (
    <section className="dia" aria-labelledby="dia-titulo">
      <div className="dia-cabeca">
        <h2 id="dia-titulo">Hoje</h2>
        {podeAgenda && <a className="dia-link" href={TELAS.agenda}>Ver agenda</a>}
      </div>

      {carregando ? (
        <div className="esqueleto dia-esqueleto" aria-hidden="true" />
      ) : (
        <>
          <ReguaDoDia claro agora={agora}
            itens={itens.map((e) => ({ id: e.id, hora: e.hora, titulo: e.titulo || e.texto, tipo: e.tipo, status: e.situacao }))} />

          <ol className="dia-lista rolavel" ref={listaRef}>
            {itens.map((e) => {
              const nota = e.tipo === 'nota';
              const agoraEste = e.id === proximoId;
              return (
                <li key={(nota ? 'nota-' : '') + e.id} data-id={e.id}
                  className={'dia-item tipo-' + e.tipo + (e.situacao ? ' dia-item--' + e.situacao : '') + (agoraEste ? ' dia-item--proximo' : '')}>
                  <time className="dia-hora">{e.hora}</time>
                  <span className="dia-icone" aria-hidden="true">{ICONES_TIPO[e.tipo]}</span>
                  <span className="dia-texto">
                    <strong>{nota ? e.texto : e.titulo}</strong>
                    <small>
                      {agoraEste ? <span className="dia-marca">Próximo</span>
                        : e.situacao && <span className="dia-marca">{SITUACAO[e.situacao]}</span>}
                      {nota ? NOMES_TIPO.nota : e.detalhe || NOMES_TIPO[e.tipo]}
                    </small>
                  </span>
                  {nota ? aoRemoverNota && (
                    <button type="button" className="btn-icone" aria-label={'Remover anotação: ' + e.texto} onClick={() => aoRemoverNota(e.id)}>
                      <IconeFechar />
                    </button>
                  ) : e.status ? (
                    <span className="dia-feito" aria-hidden="true">{e.status === 'feito' && <IconeCheck />}</span>
                  ) : (
                    <button type="button" className="dia-marcar" aria-label={'Marcar como feito: ' + e.titulo} onClick={() => aoConcluir(e.id)}>
                      <IconeCheck />
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        </>
      )}
    </section>
  );
}
