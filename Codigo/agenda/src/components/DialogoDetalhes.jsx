import { useEffect, useState } from 'react';
import { antecedencia, dataPorExtenso, descreverRecorrencia } from '../utils/datas.js';
import Dialogo from '@ds/Dialogo.jsx';
import { ICONES_TIPO, IconeFechar, IconeRelogio, IconeRepetir, IconeSino } from './Icones.jsx';

/* Detalhes de um compromisso, com as ações possíveis.
   Status só muda em compromisso que não se repete (num recorrente valeria para todos os dias). */
export default function DialogoDetalhes({ evento, rotuloTipo, statusInfo, aoFechar, aoMudarStatus, aoExcluir }) {
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  useEffect(() => {
    setConfirmarExclusao(false);
  }, [evento]);

  const e = evento;
  const status = e && statusInfo(e.status);
  const podeMudarStatus = e && !e.recorrencia;

  return (
    <Dialogo aberto={!!e} aoFechar={aoFechar} tituloId="detalhe-titulo" className="dialogo-detalhe">
      {e && (
        <>
          <div className={'detalhe-topo ' + e.tipo}>
            <span className="tipo-icone" aria-hidden="true">{ICONES_TIPO[e.tipo]}</span>
            <div>
              <p className="detalhe-tipo">{rotuloTipo(e.tipo)}</p>
              <h2 id="detalhe-titulo">{e.titulo}</h2>
              {e.subtitulo && <p className="detalhe-sub">{e.subtitulo}</p>}
            </div>
            <button type="button" className="btn-icone fechar" aria-label="Fechar" onClick={aoFechar}>
              <IconeFechar />
            </button>
          </div>

          <dl className="detalhe-info">
            <div>
              <dt><IconeRelogio /> Quando</dt>
              <dd>{dataPorExtenso(e.data)}, às {e.horario}</dd>
            </div>
            <div>
              <dt><IconeRepetir /> Repetição</dt>
              <dd>{descreverRecorrencia(e.recorrencia)}</dd>
            </div>
            <div>
              <dt><IconeSino /> Lembrete</dt>
              <dd>{e.lembrete?.ativo ? antecedencia(e.lembrete.minutosAntes) : 'Sem lembrete'}</dd>
            </div>
            <div>
              <dt><span className="ponto-status" style={{ '--status': status.cor }} /> Situação</dt>
              <dd>{status.rotulo}</dd>
            </div>
          </dl>

          {confirmarExclusao ? (
            <div className="detalhe-confirma" role="alert">
              <p>
                Excluir este compromisso{e.recorrencia ? ' e todas as repetições' : ''}? Não dá para desfazer.
              </p>
              <div className="dialogo-botoes">
                <button type="button" className="btn" onClick={() => setConfirmarExclusao(false)}>Voltar</button>
                <button type="button" className="btn btn-perigo" onClick={() => aoExcluir(e)}>Excluir</button>
              </div>
            </div>
          ) : (
            <div className="dialogo-botoes detalhe-acoes">
              {podeMudarStatus && e.status !== 'concluido' && e.status !== 'cancelado' && (
                <button type="button" className="btn btn-primario" onClick={() => aoMudarStatus(e, 'concluido')}>
                  Marcar como concluído
                </button>
              )}
              {podeMudarStatus && e.status === 'pendente' && (
                <button type="button" className="btn" onClick={() => aoMudarStatus(e, 'confirmado')}>Confirmar</button>
              )}
              {podeMudarStatus && (e.status === 'concluido' || e.status === 'cancelado') && (
                <button type="button" className="btn" onClick={() => aoMudarStatus(e, 'confirmado')}>Reabrir</button>
              )}
              {podeMudarStatus && e.status !== 'cancelado' && e.status !== 'concluido' && (
                <button type="button" className="btn" onClick={() => aoMudarStatus(e, 'cancelado')}>Desmarcar</button>
              )}
              <button type="button" className="btn btn-texto-perigo" onClick={() => setConfirmarExclusao(true)}>
                Excluir
              </button>
            </div>
          )}
        </>
      )}
    </Dialogo>
  );
}
