import { USUARIO } from '../data/db.js';
import { TELAS } from '../navegacao.js';
import {
  IconeAgenda, IconeCuidadores, IconeHistorico, IconeInicio, IconeLinhaDoTempo, IconeLista,
  IconeMais, IconePerfis, IconePilula, IconeTarefas, Logo, Ondas, SetaDireita,
} from './Icones.jsx';

/* as outras telas rodam cada uma no seu servidor do Vite (endereços em src/navegacao.js).
   "Medicamentos" leva à lista do dia (medicamentos); esta tela é o cadastro. */
const MENU = [
  { rotulo: 'Início', Icone: IconeInicio, href: TELAS.inicio },
  { rotulo: 'Agenda', Icone: IconeAgenda, href: TELAS.agenda },
  { rotulo: 'Medicamentos', Icone: IconePilula, href: TELAS.medicamentos, ativo: true },
  { rotulo: 'Tarefas', Icone: IconeTarefas, href: TELAS.tarefas },
  { rotulo: 'Linha do tempo', Icone: IconeLinhaDoTempo, href: TELAS.linhaDoTempo },
  { rotulo: 'Histórico', Icone: IconeHistorico, href: '#' },
  { rotulo: 'Cuidadores', Icone: IconeCuidadores, href: TELAS.cuidadores },
  { rotulo: 'Perfis', Icone: IconePerfis, href: TELAS.perfis },
];

export default function Sidebar({ aoNovoMedicamento, aoVerCadastrados }) {
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
            <button type="button" onClick={aoNovoMedicamento}>
              <IconeMais />
              Novo medicamento
            </button>
          </li>
          <li>
            <button type="button" onClick={aoVerCadastrados}>
              <IconeLista />
              Ver cadastrados
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
