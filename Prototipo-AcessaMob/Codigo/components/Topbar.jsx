import Icon from "./Icons";

function formattedDate() {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());
}

export default function Topbar({ onNotify }) {
  return (
    <header className="topbar">
      <div className="mobile-brand">
        <span className="brand-mark brand-mark-small" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="30" height="30" fill="none">
            <circle cx="17" cy="9" r="5" fill="#406399" />
            <circle cx="31" cy="13" r="4" fill="#7899D8" />
            <path d="M6 31c3-9 11-13 18-10 5 2 7 7 12 5 3-1 5-4 7-7 1 13-7 23-20 23C13 42 7 37 6 31Z" fill="#406399" />
            <path d="M13 27c3-4 8-5 12-2 3 3 5 7 10 6 2 0 4-1 6-3-3 7-9 11-17 10-5-1-9-5-11-11Z" fill="#CAD6EF" />
          </svg>
        </span>
        <strong>AcessaMob</strong>
      </div>
      <div className="topbar-spacer" />
      <button className="icon-button notification-button" type="button" onClick={onNotify} aria-label="Notificações">
        <Icon name="bell" size={20} />
        <span className="notification-dot" />
      </button>
      <div className="topbar-divider" />
      <div className="date-pill"><Icon name="calendar" size={17} /><span>{formattedDate()}</span></div>
      <button className="account-button" type="button" onClick={onNotify} aria-label="Perfil de Maria Silva">
        <span className="avatar">M</span>
        <span className="account-name">Maria Silva</span>
        <Icon name="chevrondown" size={15} />
      </button>
    </header>
  );
}
