import Icon from "./Icon.jsx";
import Logo from "./Logo.jsx";

const menuItems = [
  { id: "inicio", label: "Início", icone: "home" },
  { id: "agenda", label: "Agenda", icone: "calendar" },
  { id: "medicamentos", label: "Medicamentos", icone: "pill" },
  { id: "historico", label: "Histórico", icone: "history" },
  { id: "perfis", label: "Perfis", icone: "users" }
];

const atalhos = [
  { label: "Adicionar cuidado", icone: "plus" },
  { label: "Ver próximos horários", icone: "calendar" },
  { label: "Central de ajuda", icone: "help" }
];

function Sidebar({ paginaAtiva }) {
  return (
    <aside className="sidebar">
      <a href="#" className="brand">
        <Logo variante="claro" />
        <span>
          <strong>AcessaMob</strong>
          <small>Mais cuidado, todos os dias.</small>
        </span>
      </a>

      <nav className="menu" aria-label="Menu principal">
        {menuItems.map(function (item) {
          let classe = "menu-item";
          let ariaCurrent = undefined;

          if (item.id === paginaAtiva) {
            classe = "menu-item active";
            ariaCurrent = "page";
          }

          return (
            <a key={item.id} href="#" className={classe} aria-current={ariaCurrent}>
              <Icon name={item.icone} />
              {item.label}
            </a>
          );
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
        <span className="avatar">M</span>
        <span className="sidebar-user-info">
          <strong>Maria Silva</strong>
          <small>Cuidador(a)</small>
        </span>
        <Icon name="chevron-right" />
      </a>
      <small className="version">AcessaMob v1.0.0</small>
    </aside>
  );
}

export default Sidebar;
