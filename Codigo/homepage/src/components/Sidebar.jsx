import { USUARIO } from '../data/cuidados.js';
import {
  IconeAgenda, IconeAjuda, IconeHistorico, IconeHorarios, IconeInicio,
  IconeMais, IconePerfis, IconePilula, Logo, Ondas, SetaDireita,
} from './Icones.jsx';

const MENU = [
  { rotulo: 'Início', Icone: IconeInicio, ativo: true },
  { rotulo: 'Agenda', Icone: IconeAgenda },
  { rotulo: 'Medicamentos', Icone: IconePilula },
  { rotulo: 'Histórico', Icone: IconeHistorico },
  { rotulo: 'Perfis', Icone: IconePerfis },
];

export default function Sidebar({ aoAdicionarCuidado, aoVerHorarios, aoAbrirAjuda }) {
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
            <button type="button" onClick={aoAdicionarCuidado}>
              <IconeMais />
              Adicionar cuidado
            </button>
          </li>
          <li>
            <button type="button" onClick={aoVerHorarios}>
              <IconeHorarios />
              Ver próximos horários
            </button>
          </li>
          <li>
            <button type="button" onClick={aoAbrirAjuda}>
              <IconeAjuda />
              Central de ajuda
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
