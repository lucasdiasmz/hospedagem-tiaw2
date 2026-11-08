import { USUARIO } from '../data/db.js';
import {
  IconeAgenda, IconeCarrinho, IconeHistorico, IconeInicio, IconeMais,
  IconePerfis, IconePilula, IconeTarefas, Logo, Ondas, SetaDireita,
} from './Icones.jsx';

const MENU = [
  { rotulo: 'Início', Icone: IconeInicio },
  { rotulo: 'Agenda', Icone: IconeAgenda },
  { rotulo: 'Medicamentos', Icone: IconePilula },
  { rotulo: 'Tarefas', Icone: IconeTarefas, ativo: true },
  { rotulo: 'Histórico', Icone: IconeHistorico },
  { rotulo: 'Perfis', Icone: IconePerfis },
];

export default function Sidebar({ aoNovaTarefa, aoVerCompras }) {
  return (
    <aside className="sidebar">
      <div className="marca">
        <Logo />
        <div>
          <span className="marca-nome">AcessaMob</span>
          <small>Mais cuidado, todos os dias.</small>
        </div>
      </div>

      <nav className="menu" aria-label="Navegação principal">
        <ul>
          {MENU.map(({ rotulo, Icone, ativo }) => (
            <li key={rotulo}>
              <a href="#" className={'menu-item' + (ativo ? ' ativo' : '')} aria-current={ativo ? 'page' : undefined}>
                <Icone />
                <span>{rotulo}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="atalhos">
        <p className="atalhos-titulo">Atalhos</p>
        <ul>
          <li>
            <button type="button" onClick={aoNovaTarefa}>
              <IconeMais />
              Nova tarefa
            </button>
          </li>
          <li>
            <button type="button" onClick={aoVerCompras}>
              <IconeCarrinho />
              Lista de compras
            </button>
          </li>
        </ul>
      </div>

      <a href="#" className="usuario">
        <span className="avatar-claro" aria-hidden="true">{USUARIO.nome[0]}</span>
        <span className="usuario-texto"><strong>{USUARIO.nomeCompleto}</strong><small>{USUARIO.papel}</small></span>
        <SetaDireita />
      </a>

      <Ondas />
      <p className="versao">AcessaMob v1.0.0</p>
    </aside>
  );
}
