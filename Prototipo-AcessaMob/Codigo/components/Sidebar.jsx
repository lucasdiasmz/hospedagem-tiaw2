import Icon from "./Icons";

const navigation = [
  { id: "inicio", label: "Início", icon: "home" },
  { id: "agenda", label: "Agenda", icon: "calendar" },
  { id: "medicamentos", label: "Medicamentos", icon: "pill" },
  { id: "historico", label: "Histórico", icon: "history" },
  { id: "perfis", label: "Perfis", icon: "users" },
];

export default function Sidebar({ activeItem, onNavigate }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#conteudo-principal" aria-label="AcessaMob, ir para o conteúdo">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
            <circle cx="17" cy="9" r="5" fill="#CAD6EF" />
            <circle cx="31" cy="13" r="4" fill="#8EACEC" />
            <path d="M6 31c3-9 11-13 18-10 5 2 7 7 12 5 3-1 5-4 7-7 1 13-7 23-20 23C13 42 7 37 6 31Z" fill="#7899D8" />
            <path d="M13 27c3-4 8-5 12-2 3 3 5 7 10 6 2 0 4-1 6-3-3 7-9 11-17 10-5-1-9-5-11-11Z" fill="#E5ECFB" />
          </svg>
        </span>
        <span className="brand-copy">
          <strong>AcessaMob</strong>
          <small>Mais cuidado, todos os dias.</small>
        </span>
      </a>

      <div className="sidebar-section-label">MENU PRINCIPAL</div>
      <nav className="side-nav" aria-label="Navegação principal">
        {navigation.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`side-nav-item ${activeItem === item.id ? "is-active" : ""}`}
            onClick={() => onNavigate(item.id)}
            aria-current={activeItem === item.id ? "page" : undefined}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
            {item.id === "agenda" && <span className="nav-current-dot" aria-hidden="true" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-note">
        <span className="sidebar-note-icon"><Icon name="spark" size={18} /></span>
        <div>
          <strong>Cuidado organizado</strong>
          <p>Informações importantes em um só lugar.</p>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="profile-row">
          <div className="avatar avatar-sidebar">M</div>
          <div className="profile-copy"><strong>Maria Silva</strong><span>Familiar responsável</span></div>
        </div>
        <div className="sidebar-version">AcessaMob <span>•</span> Protótipo 1.0</div>
      </div>
    </aside>
  );
}
