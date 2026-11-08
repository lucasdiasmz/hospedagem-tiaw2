import { Fragment, useEffect, useState } from 'react';
import { dataCompacta, dataCurta, descreverRecorrencia, diaRelativo, hoje, horaAgora, somarDias } from '../utils/datas.js';
import { ICONES_TIPO, IconeRepetir, SetaDireita, SetaEsquerda } from './Icones.jsx';

/* re-renderiza a cada 30 s para a linha "Agora" andar */
function useHoraAtual() {
  const [hora, setHora] = useState(horaAgora);
  useEffect(() => {
    const timer = setInterval(() => setHora(horaAgora()), 30000);
    return () => clearInterval(timer);
  }, []);
  return hora;
}

/* "3 compromissos · 1 concluído" */
function contagem(eventos) {
  if (!eventos.length) return 'Nada marcado';
  const n = eventos.length;
  const feitos = eventos.filter((e) => e.status === 'concluido').length;
  return (n === 1 ? '1 item' : n + ' itens') + (feitos ? ` · ${feitos} concluído${feitos > 1 ? 's' : ''}` : '');
}

/* Painel lateral: o dia selecionado como linha do tempo e os próximos compromissos */
export default function PainelDia({
  data, eventos, carregado, proximos, proximosRef, rotuloTipo, statusInfo, aoSelecionar, aoAbrir, aoNovo,
}) {
  const agora = useHoraAtual();
  const ehHoje = data === hoje();
  const relativo = diaRelativo(data);
  /* posição da linha "Agora": antes do primeiro item que ainda não passou */
  const indiceAgora = ehHoje ? eventos.findIndex((e) => e.horario > agora) : -1;
  const agoraNoFim = ehHoje && indiceAgora === -1 && eventos.length > 0;

  const linhaAgora = (
    <li className="agora" aria-label={'Agora, ' + agora}>
      <span className="agora-hora">{agora}</span>
      <span className="agora-linha" aria-hidden="true"></span>
    </li>
  );

  return (
    <aside className="card painel" aria-labelledby="painel-titulo">
      <div className="painel-topo">
        <div>
          <h2 id="painel-titulo">
            {relativo && <span className={'tag-relativo' + (ehHoje ? ' hoje' : '')}>{relativo}</span>}
            {dataCurta(data)}
          </h2>
          <p>{carregado ? contagem(eventos) : 'Carregando…'}</p>
        </div>
        <div className="setas">
          <button type="button" className="btn-icone" aria-label="Dia anterior" onClick={() => aoSelecionar(somarDias(data, -1))}>
            <SetaEsquerda />
          </button>
          <button type="button" className="btn-icone" aria-label="Próximo dia" onClick={() => aoSelecionar(somarDias(data, 1))}>
            <SetaDireita />
          </button>
        </div>
      </div>

      {carregado && eventos.length === 0 ? (
        <div className="painel-vazio">
          <p>Nenhum compromisso neste dia.</p>
          <button type="button" className="link-acao" onClick={aoNovo}>Adicionar compromisso</button>
        </div>
      ) : (
        <ol className="linha-tempo">
          {eventos.map((e, i) => {
            const status = statusInfo(e.status);
            const passou = ehHoje && e.horario <= agora;
            return (
              <Fragment key={e.chave}>
                {i === indiceAgora && linhaAgora}
                <li className={`tempo-item ${e.tipo} status-${e.status}` + (passou ? ' passou' : '')}>
                  <span className="tempo-hora">{e.horario}</span>
                  <button type="button" className="tempo-cartao" onClick={() => aoAbrir(e)}>
                    <span className="tipo-icone" aria-hidden="true">{ICONES_TIPO[e.tipo]}</span>
                    <span className="tempo-texto">
                      <strong>{e.titulo}</strong>
                      <small>
                        {e.recorrencia && <IconeRepetir />}
                        {e.subtitulo || rotuloTipo(e.tipo)}
                      </small>
                    </span>
                    {e.status !== 'confirmado' && (
                      <span className="status" style={{ '--status': status.cor }}>{status.rotulo}</span>
                    )}
                  </button>
                </li>
              </Fragment>
            );
          })}
          {agoraNoFim && linhaAgora}
        </ol>
      )}

      <section ref={proximosRef} className="proximos" aria-labelledby="proximos-titulo" tabIndex={-1}>
        <h3 id="proximos-titulo">Próximos compromissos</h3>
        {proximos.length === 0 ? (
          <p className="vazio">Nenhuma consulta, exame ou visita marcada.</p>
        ) : (
          <ul>
            {proximos.map((e) => (
              <li key={e.chave}>
                <button type="button" className={'proximo ' + e.tipo} onClick={() => aoSelecionar(e.data)}>
                  <span className="ponto" aria-hidden="true"></span>
                  <span className="proximo-texto">
                    <strong>{e.titulo}</strong>
                    <small>
                      {diaRelativo(e.data) || dataCompacta(e.data)} · {e.horario}
                      {e.subtitulo && ' · ' + e.subtitulo}
                    </small>
                    {e.recorrencia && (
                      <small className="proximo-repete">
                        <IconeRepetir /> {descreverRecorrencia(e.recorrencia)}
                      </small>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
