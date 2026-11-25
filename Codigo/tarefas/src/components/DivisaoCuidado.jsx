import { divisaoDoCuidado, iniciais, nomeCurto } from '../utils/tarefas.js';
import { IconePerfis } from './Icones.jsx';

export default function DivisaoCuidado({ membros, tarefas }) {
  const divisao = divisaoDoCuidado(membros, tarefas);
  const concluidas = tarefas.filter((t) => t.status === 'concluido').length;

  return (
    <section className="card divisao" aria-labelledby="divisao-titulo">
      <h2 id="divisao-titulo"><IconePerfis />Divisão do cuidado</h2>
      <p className="divisao-sub">
        {concluidas === 1 ? '1 tarefa concluída' : concluidas + ' tarefas concluídas'} até agora. A barra mostra quanto cada pessoa assumiu.
      </p>

      <ul className="membros rolavel">
        {divisao.map((m) => (
          <li key={m.id}>
            <span className="avatar-membro" aria-hidden="true">{iniciais(m.nome)}</span>
            <span className="membro-texto">
              <strong>{nomeCurto(m)}</strong>
              <small>{m.papel}</small>
              <span className="barra" aria-hidden="true"><span style={{ width: m.pct + '%' }}></span></span>
            </span>
            <span className="pct">{m.pct}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
