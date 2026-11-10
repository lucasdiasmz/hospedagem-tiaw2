import Icon from "../Icon.jsx";

function FiltroMembro({ membros, filtroAtual, onFiltrar }) {
  return (
    <div className="filtro-membro">
      <label htmlFor="filtroMembro">
        <Icon name="users" />
        Membro da rede
      </label>
      <select
        id="filtroMembro"
        value={filtroAtual}
        onChange={function (evento) {
          onFiltrar(evento.target.value);
        }}
      >
        <option value="todos">Todos os membros</option>
        {membros.map(function (membro) {
          return (
            <option key={membro.nome} value={membro.nome}>
              {membro.rotulo} · {membro.papel}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default FiltroMembro;
