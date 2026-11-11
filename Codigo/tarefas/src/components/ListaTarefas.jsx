import { useState } from 'react';
import { ABAS, atrasada, dinheiro, formatarPrazo, nomeCurto } from '../utils/tarefas.js';
import { IconeCarrinho, IconeEstetoscopio, IconeEstrela, IconeMais, IconePilula, IconeTarefas, SetaBaixo } from './Icones.jsx';

const ICONE_CATEGORIA = {
  Consulta: IconeEstetoscopio,
  Compra: IconeCarrinho,
  Medicamento: IconePilula,
  Outro: IconeEstrela,
};

/* ações de cada aba: para onde a tarefa pode ir */
const ACOES = {
  a_fazer: [{ para: 'em_andamento', rotulo: 'Iniciar' }, { para: 'concluido', rotulo: 'Concluir' }],
  em_andamento: [{ para: 'a_fazer', rotulo: 'Voltar para A fazer' }, { para: 'concluido', rotulo: 'Concluir' }],
  concluido: [{ para: 'a_fazer', rotulo: 'Reabrir' }],
};

export default function ListaTarefas({ tarefas, membros, carregando, aba, aoMudarAba, aoMudarStatus, aoCriar, secaoRef }) {
  const [aberta, setAberta] = useState(null);
  const daAba = tarefas.filter((t) => t.status === aba);

  function membro(id) {
    return membros.find((m) => m.id === id);
  }

  return (
    <section className="card lista-tarefas" ref={secaoRef} aria-labelledby="tarefas-titulo">
      <h2 id="tarefas-titulo">
        <span className="icone-tile" aria-hidden="true"><IconeTarefas /></span>
        Tarefas da rede
      </h2>

      <div className="abas" role="tablist" aria-label="Status das tarefas">
        {ABAS.map((a) => (
          <button
            key={a.status}
            type="button"
            role="tab"
            aria-selected={aba === a.status}
            className={'aba' + (aba === a.status ? ' ativa' : '')}
            onClick={() => { aoMudarAba(a.status); setAberta(null); }}
          >
            {a.rotulo} <span className="contador">{tarefas.filter((t) => t.status === a.status).length}</span>
          </button>
        ))}
      </div>

      {carregando ? (
        <p className="vazio">Carregando...</p>
      ) : daAba.length === 0 ? (
        <p className="vazio">Nenhuma tarefa nesta aba.</p>
      ) : (
        <ul className="tarefas">
          {daAba.map((t) => {
            const Icone = ICONE_CATEGORIA[t.categoria];
            const expandida = aberta === t.id;
            const total = t.itensCompra.reduce((s, i) => s + i.preco, 0);
            return (
              <li key={t.id} className={'tarefa' + (t.status === 'concluido' ? ' feita' : '')}>
                <button
                  type="button"
                  className="tarefa-topo"
                  aria-expanded={expandida}
                  onClick={() => setAberta(expandida ? null : t.id)}
                >
                  <span className="tarefa-icone" aria-hidden="true"><Icone /></span>
                  <span className="tarefa-texto">
                    <strong>{t.titulo}</strong>
                    <span className="chips-linha">
                      <span className="chip">{t.categoria}</span>
                      {atrasada(t) && <span className="chip chip-atraso">Atrasada</span>}
                    </span>
                    <small>Responsável: {nomeCurto(membro(t.responsavelId))}</small>
                    <small>Prazo: {formatarPrazo(t.prazo)}</small>
                  </span>
                  <span className={'seta' + (expandida ? ' girada' : '')} aria-hidden="true"><SetaBaixo /></span>
                </button>

                {expandida && (
                  <div className="tarefa-detalhe">
                    {t.observacoes && <p><b>Observações:</b> {t.observacoes}</p>}
                    {t.itensCompra.length > 0 && (
                      <p>
                        <b>Itens:</b>{' '}
                        {t.itensCompra.map((i) => i.nome + (i.comprado ? ' (comprado)' : '')).join(', ')}
                        {' · '}Total {dinheiro(total)}
                      </p>
                    )}
                    <p>
                      <b>Lembrete:</b>{' '}
                      {t.lembretes.avisarResponsavel ? 'avisa o responsável 1 hora antes' : 'sem aviso ao responsável'}
                      {t.lembretes.avisarRedeSeAtrasar && ' e a rede se atrasar'}
                    </p>
                    {t.concluidoEm && <p><b>Concluída em:</b> {formatarPrazo(t.concluidoEm)}</p>}
                    <div className="acoes">
                      {ACOES[t.status].map((a) => (
                        <button
                          key={a.para}
                          type="button"
                          className={'btn-acao' + (a.para === 'concluido' ? ' forte' : '')}
                          onClick={() => aoMudarStatus(t, a.para)}
                        >
                          {a.rotulo}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" className="btn btn-primario btn-largo" onClick={aoCriar}>
        <IconeMais /> Criar tarefa
      </button>
    </section>
  );
}
