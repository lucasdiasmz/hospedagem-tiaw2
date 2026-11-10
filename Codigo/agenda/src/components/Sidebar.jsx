import {
  IconeAgenda, IconeAjuda, IconeHistorico, IconeHorarios, IconeInicio,
  IconeMais, IconePerfis, IconePilula, Ondas, SetaDireita,
} from './Icones.jsx';
import logo from '../assets/logo-acessamob.png';

const PAPEIS = { cuidador: 'Cuidador(a)', cliente: 'Responsável' };

/* a tela inicial roda em outro servidor do Vite (Codigo/homepage, porta 5173) */
const URL_INICIO = import.meta.env.VITE_URL_HOMEPAGE || 'http://localhost:5173/';

const MENU = [
  { rotulo: 'Início', Icone: IconeInicio, href: URL_INICIO },
  { rotulo: 'Agenda', Icone: IconeAgenda, href: '/', ativo: true },
  { rotulo: 'Medicamentos', Icone: IconePilula, href: '#' },
  { rotulo: 'Histórico', Icone: IconeHistorico, href: '#' },
  { rotulo: 'Perfis', Icone: IconePerfis, href: '#' },
];

export default function Sidebar({ usuario, aoNovoCompromisso, aoVerProximos }) {
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
          {MENU.map(({ rotulo, Icone, href, ativo }) => (
            <li key={rotulo}>
              <a href={href} className={'menu-item' + (ativo ? ' ativo' : '')} aria-current={ativo ? 'page' : undefined}>
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
            <button type="button" onClick={aoNovoCompromisso}>
              <IconeMais />
              Novo compromisso
            </button>
          </li>
          <li>
            <button type="button" onClick={aoVerProximos}>
              <IconeHorarios />
              Ver próximos dias
            </button>
          </li>
          <li>
            {/* o pedido de ajuda é feito na tela inicial */}
            <a href={URL_INICIO}>
              <IconeAjuda />
              Central de ajuda
            </a>
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
