import { divisaoDoCuidado, iniciais, nomeCurto } from '../utils/tarefas.js';
import { IconePerfis } from './Icones.jsx';

export default function DivisaoCuidado({ membros, tarefas }) {
  const divisao = divisaoDoCuidado(membros, tarefas);
  const concluidas = tarefas.filter((t) => t.status === 'concluido').length;

  return (
    <section className="card divisao" aria-labelledby="divisao-titulo">
      <h2 id="divisao-titulo">
        <span className="icone-tile" aria-hidden="true"><IconePerfis /></span>
        <span>
          Divisão do cuidado
          <small className="para">
            {concluidas === 1 ? '1 tarefa concluída' : concluidas + ' tarefas concluídas'} até agora
          </small>
        </span>
      </h2>

      <ul className="membros">
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
