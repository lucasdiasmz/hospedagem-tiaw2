import { TIPOS } from '../hooks/useCuidadosDoDia.js';
import { ICONES_RESUMO } from './Icones.jsx';

const ROTULOS = { med: 'Medicação', consulta: 'Consulta', tarefa: 'Tarefas', visita: 'Visitas' };

/* contadores e anel de progresso, calculados a partir da linha do tempo */
export default function CardCuidados({ contagem }) {
  let total = 0;
  let feitos = 0;
  TIPOS.forEach((tipo) => {
    total += contagem[tipo].total;
    feitos += contagem[tipo].feitos;
  });
  const pct = total ? Math.round((feitos / total) * 100) : 0;

  return (
    <section className="card card-cuidados">
      <div className="cuidados-topo">
        <div>
          <h2>Seus cuidados de hoje</h2>
          <p>{feitos} de {total} Concluídos</p>
        </div>
        <div className="anel" role="img" aria-label={pct + '% concluído'} style={{ '--pct': pct + '%' }}>
          <span>{pct}%</span>
        </div>
      </div>
      <div className="resumo">
        {TIPOS.map((tipo) => (
          <div className="resumo-item" key={tipo}>
            <span className="icone">{ICONES_RESUMO[tipo]}</span>
            <div>
              <span className="rotulo">{ROTULOS[tipo]}</span>
              <span className="valor">{contagem[tipo].feitos}/{contagem[tipo].total}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
