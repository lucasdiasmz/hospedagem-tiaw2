import { NavLink } from "react-router-dom";
import {
  IconeAgenda, IconeAjuda, IconeCuidadores, IconeHistorico, IconeInicio,
  IconeLinhaDoTempo, IconePerfis, IconePilula, IconeTarefas, Ondas, SetaDireita
} from "./Icones.jsx";
import logo from "../assets/logo-acessamob.png";
import { USUARIO_LOGADO } from "../data/usuario.js";
import { TELAS } from "../navegacao.js";

/* mesmo menu lateral da tela inicial (Codigo/inicio).
   "rota" = tela deste módulo; "href" = tela de outro módulo (endereços em src/navegacao.js) */
const MENU = [
  { rotulo: "Início", Icone: IconeInicio, href: TELAS.inicio },
  { rotulo: "Agenda", Icone: IconeAgenda, href: TELAS.agenda },
  { rotulo: "Medicamentos", Icone: IconePilula, href: TELAS.medicamentos },
  { rotulo: "Tarefas", Icone: IconeTarefas, href: TELAS.tarefas },
  { rotulo: "Linha do tempo", Icone: IconeLinhaDoTempo, rota: "/linha-do-tempo" },
  { rotulo: "Histórico", Icone: IconeHistorico, href: "#" },
  { rotulo: "Cuidadores", Icone: IconeCuidadores, href: TELAS.cuidadores },
  { rotulo: "Perfis", Icone: IconePerfis, rota: "/perfil" }
];

function classeMenu({ isActive }) {
  return isActive ? "menu-item ativo" : "menu-item";
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <a href={TELAS.inicio} className="marca">
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
          {MENU.map(function ({ rotulo, Icone, href, rota }) {
            return (
              <li key={rotulo}>
                {rota ? (
                  <NavLink to={rota} className={classeMenu}>
                    <Icone />
                    <span>{rotulo}</span>
                  </NavLink>
                ) : (
                  <a href={href} className="menu-item">
                    <Icone />
                    <span>{rotulo}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="atalhos">
        <p className="atalhos-titulo">Atalhos</p>
        <ul>
          <li>
            <NavLink to="/linha-do-tempo">
              <IconeLinhaDoTempo />
              Registrar no diário
            </NavLink>
          </li>
          <li>
            <a href={TELAS.agenda}>
              <IconeAgenda />
              Ver próximos horários
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

      <NavLink to="/perfil" className="usuario">
        <span className="avatar-claro" aria-hidden="true">{USUARIO_LOGADO.nome[0]}</span>
        <span className="usuario-texto">
          <strong>{USUARIO_LOGADO.nome}</strong>
          <small>{USUARIO_LOGADO.papel}</small>
        </span>
        <SetaDireita />
      </NavLink>

      <Ondas />
      <p className="versao">AcessaMob v1.1.0</p>
    </aside>
  );
}

export default Sidebar;
