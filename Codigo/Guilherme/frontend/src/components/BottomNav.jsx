import { NavLink } from "react-router-dom";
import Icon from "./Icon.jsx";

const itens = [
  { id: "inicio", label: "Início", icone: "home", rota: null },
  { id: "agenda", label: "Agenda", icone: "calendar", rota: null },
  { id: "linha-do-tempo", label: "Diário", icone: "book-open", rota: "/linha-do-tempo" },
  { id: "medicamentos", label: "Remédios", icone: "pill", rota: null },
  { id: "historico", label: "Histórico", icone: "history", rota: null },
  { id: "perfis", label: "Perfis", icone: "users", rota: "/perfil" }
];

function getClasseItem({ isActive }) {
  if (isActive) {
    return "active";
  } else {
    return "";
  }
}

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegação">
      {itens.map(function (item) {
        if (item.rota) {
          return (
            <NavLink key={item.id} to={item.rota} className={getClasseItem}>
              <Icon name={item.icone} />
              {item.label}
            </NavLink>
          );
        } else {
          return (
            <a key={item.id} href="#">
              <Icon name={item.icone} />
              {item.label}
            </a>
          );
        }
      })}
    </nav>
  );
}

export default BottomNav;
