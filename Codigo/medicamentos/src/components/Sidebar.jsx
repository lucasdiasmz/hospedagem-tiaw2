import {
  IconeAgenda, IconeAjuda, IconeCuidadores, IconeHistorico, IconeInicio,
  IconeLinhaDoTempo, IconeMais, IconePerfis, IconePilula, IconeTarefas, Ondas, SetaDireita,
} from './Icones.jsx';
import logo from '../assets/logo-acessamob.png';
import { TELAS } from '../navegacao.js';

/* mesmo menu lateral da tela inicial (Codigo/inicio); endereços em src/navegacao.js */
const MENU = [
  { rotulo: 'Início', Icone: IconeInicio, href: TELAS.inicio },
  { rotulo: 'Agenda', Icone: IconeAgenda, href: TELAS.agenda },
  { rotulo: 'Medicamentos', Icone: IconePilula, href: './', ativo: true },
  { rotulo: 'Tarefas', Icone: IconeTarefas, href: TELAS.tarefas },
  { rotulo: 'Linha do tempo', Icone: IconeLinhaDoTempo, href: TELAS.linhaDoTempo },
  { rotulo: 'Histórico', Icone: IconeHistorico, href: '#' },
  { rotulo: 'Cuidadores', Icone: IconeCuidadores, href: TELAS.cuidadores },
  { rotulo: 'Perfis', Icone: IconePerfis, href: TELAS.perfis },
];

const USUARIO = { nome: 'Maria Silva', papel: 'Cuidadora familiar' };

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <a className="marca" href={TELAS.inicio}>
        <span className="marca-logo">
          <img src={logo} alt="" width="52" height="52" />
        </span>
        <div>
          <span className="marca-nome">AcessaMob</span>
          <small>Mais cuidado, todos os dias.</small>
        </div>
      </a>

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
            <a href={TELAS.cadastroMedicamentos}>
              <IconeMais />
              Cadastrar medicamento
            </a>
          </li>
          <li>
            <a href={TELAS.agenda}>
              <IconeAgenda />
              Ver agenda do dia
            </a>
          </li>
          <li>
            <a href={TELAS.inicio}>
              <IconeAjuda />
              Central de ajuda
            </a>
          </li>
        </ul>
      </div>

      <a href={TELAS.perfis} className="usuario">
        <span className="avatar-claro" aria-hidden="true">{USUARIO.nome[0]}</span>
        <span className="usuario-texto"><strong>{USUARIO.nome}</strong><small>{USUARIO.papel}</small></span>
        <SetaDireita />
      </a>

      <Ondas />
      <p className="versao">AcessaMob v1.0.0</p>
    </aside>
  );
}
