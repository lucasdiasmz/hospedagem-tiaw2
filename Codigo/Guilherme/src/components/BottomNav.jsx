import Icon from "./Icon.jsx";

const itens = [
  { id: "inicio", label: "Início", icone: "home" },
  { id: "agenda", label: "Agenda", icone: "calendar" },
  { id: "medicamentos", label: "Remédios", icone: "pill" },
  { id: "historico", label: "Histórico", icone: "history" },
  { id: "perfis", label: "Perfis", icone: "users" }
];

function BottomNav({ paginaAtiva }) {
  return (
    <nav className="bottom-nav" aria-label="Navegação">
      {itens.map(function (item) {
        let classe = "";
        let ariaCurrent = undefined;

        if (item.id === paginaAtiva) {
          classe = "active";
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
  );
}

export default BottomNav;
