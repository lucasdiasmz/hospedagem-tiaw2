import {
  IconeAgenda, IconeAjuda, IconeCuidadores, IconeHistorico, IconeHorarios, IconeInicio,
  IconeLinhaDoTempo, IconeMais, IconePerfis, IconePilula, IconeTarefas, Ondas, SetaDireita,
} from './Icones.jsx';
import logo from '../assets/logo-acessamob.png';
import { TELAS } from '../navegacao.js';

const PAPEIS = { cuidador: 'Cuidador(a)', cliente: 'Responsável' };

/* as outras telas rodam cada uma no seu servidor do Vite (endereços em src/navegacao.js) */
const MENU = [
  { rotulo: 'Início', Icone: IconeInicio, href: '/', ativo: true },
  { rotulo: 'Agenda', Icone: IconeAgenda, href: TELAS.agenda },
  { rotulo: 'Medicamentos', Icone: IconePilula, href: TELAS.medicamentos },
  { rotulo: 'Tarefas', Icone: IconeTarefas, href: TELAS.tarefas },
  { rotulo: 'Linha do tempo', Icone: IconeLinhaDoTempo, href: TELAS.linhaDoTempo },
  { rotulo: 'Histórico', Icone: IconeHistorico, href: '#' },
  { rotulo: 'Cuidadores', Icone: IconeCuidadores, href: TELAS.cuidadores },
  { rotulo: 'Perfis', Icone: IconePerfis, href: TELAS.perfis },
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
