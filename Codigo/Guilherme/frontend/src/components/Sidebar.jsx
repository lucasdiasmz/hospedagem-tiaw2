import { NavLink } from "react-router-dom";
import Icon from "./Icon.jsx";
import Logo from "./Logo.jsx";
import { USUARIO_LOGADO } from "../data/usuario.js";
import { getIniciais } from "../utils/formatadores.js";
import { TELAS } from "../navegacao.js";

/* "rota" = tela deste módulo; "href" = tela de outro módulo (endereços em src/navegacao.js) */
const menuItems = [
  { id: "inicio", label: "Início", icone: "home", rota: null, href: TELAS.inicio },
  { id: "agenda", label: "Agenda", icone: "calendar", rota: null, href: TELAS.agenda },
  { id: "medicamentos", label: "Medicamentos", icone: "pill", rota: null, href: TELAS.medicamentos },
  { id: "tarefas", label: "Tarefas", icone: "clipboard", rota: null, href: TELAS.tarefas },
  { id: "linha-do-tempo", label: "Linha do tempo", icone: "book-open", rota: "/linha-do-tempo" },
  { id: "historico", label: "Histórico", icone: "history", rota: null },
  { id: "cuidadores", label: "Cuidadores", icone: "heart", rota: null, href: TELAS.cuidadores },
  { id: "perfis", label: "Perfis", icone: "users", rota: "/perfil" }
];

const atalhos = [
  { label: "Adicionar cuidado", icone: "plus" },
  { label: "Ver próximos horários", icone: "calendar" },
  { label: "Central de ajuda", icone: "help" }
];

function getClasseMenu({ isActive }) {
  if (isActive) {
    return "menu-item active";
  } else {
    return "menu-item";
  }
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <a href={TELAS.inicio} className="brand">
        <Logo variante="claro" />
        <span>
          <strong>AcessaMob</strong>
          <small>Mais cuidado, todos os dias.</small>
        </span>
      </a>

      <nav className="menu" aria-label="Menu principal">
        {menuItems.map(function (item) {
          if (item.rota) {
            return (
              <NavLink key={item.id} to={item.rota} className={getClasseMenu}>
                <Icon name={item.icone} />
                {item.label}
              </NavLink>
            );
          } else {
            return (
              <a key={item.id} href={item.href || "#"} className="menu-item">
                <Icon name={item.icone} />
                {item.label}
              </a>
            );
          }
        })}
      </nav>

      <div className="menu-divider"></div>
      <p className="menu-label">Atalhos</p>
      <nav className="shortcuts" aria-label="Atalhos">
        {atalhos.map(function (atalho) {
          return (
            <a key={atalho.label} href="#" className="shortcut">
              <Icon name={atalho.icone} />
              {atalho.label}
            </a>
          );
        })}
      </nav>

      <a href="#" className="sidebar-user">
        <span className="avatar">{getIniciais(USUARIO_LOGADO.nome)}</span>
        <span className="sidebar-user-info">
          <strong>{USUARIO_LOGADO.nome}</strong>
          <small>{USUARIO_LOGADO.papel}</small>
        </span>
        <Icon name="chevron-right" />
      </a>
      <small className="version">AcessaMob v1.1.0</small>
    </aside>
  );
}

export default Sidebar;
