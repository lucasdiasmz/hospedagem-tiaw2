import Icon from "./Icon.jsx";
import Logo from "./Logo.jsx";
import { formatarDataHoje } from "../utils/formatadores.js";

function Topbar() {
  return (
    <header className="topbar">
      <a href="#" className="topbar-brand">
        <Logo variante="escuro" />
        <strong>AcessaMob</strong>
      </a>
      <div className="topbar-actions">
        <button type="button" className="icon-btn" aria-label="Notificações">
          <Icon name="bell" />
          <span className="dot"></span>
        </button>
        <span className="date-chip">
          <Icon name="calendar" />
          <span>{formatarDataHoje()}</span>
        </span>
        <button type="button" className="user-chip">
          <span className="avatar">M</span>
          <span className="user-chip-name">Maria</span>
          <Icon name="chevron-down" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
