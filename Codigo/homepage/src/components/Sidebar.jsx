import {
  IconeAgenda, IconeAjuda, IconeHistorico, IconeHorarios, IconeInicio,
  IconeMais, IconePerfis, IconePilula, Ondas, SetaDireita,
} from './Icones.jsx';
import logo from '../assets/logo-acessamob.png';

const PAPEIS = { cuidador: 'Cuidador(a)', cliente: 'Responsável' };

const MENU = [
  { rotulo: 'Início', Icone: IconeInicio, ativo: true },
  { rotulo: 'Agenda', Icone: IconeAgenda },
  { rotulo: 'Medicamentos', Icone: IconePilula },
  { rotulo: 'Histórico', Icone: IconeHistorico },
  { rotulo: 'Perfis', Icone: IconePerfis },
];

export default function Sidebar({ usuario, aoAdicionarCuidado, aoVerHorarios, aoAbrirAjuda }) {
  return (
    <aside className="sidebar">
      <div className="marca">
        <span className="marca-logo">
          <img src={logo} alt="" width="52" height="52" />
        </span>
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
        <span className="avatar-claro" aria-hidden="true">{usuario?.nome[0]}</span>
        <span className="usuario-texto"><strong>{usuario?.nome}</strong><small>{PAPEIS[usuario?.tipo]}</small></span>
        <SetaDireita />
      </a>

      <Ondas />
      <p className="versao">AcessaMob v1.0.0</p>
    </aside>
  );
}
