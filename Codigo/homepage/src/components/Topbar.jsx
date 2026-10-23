import { USUARIO } from '../data/cuidados.js';
import { IconeAgenda, IconeBusca, IconeSino, SetaBaixo } from './Icones.jsx';

function dataDeHoje() {
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  return hoje.charAt(0).toUpperCase() + hoje.slice(1);
}

export default function Topbar({ busca, aoBuscar, aoAbrirAjuda }) {
  return (
    <header className="topbar">
      <label className="busca">
        <IconeBusca />
        <input
          type="search"
          value={busca}
          onChange={(e) => aoBuscar(e.target.value)}
          placeholder="Buscar por medicamento, consulta ou cuidado..."
          aria-label="Buscar na linha do tempo"
        />
      </label>
      <button className="ajuda-mobile" type="button" onClick={aoAbrirAjuda} aria-label="Central de ajuda">?</button>
      <button className="sino" type="button" aria-label="Notificações">
        <IconeSino />
        <span className="notif" aria-hidden="true"></span>
      </button>
      <div className="data-wrap">
        <IconeAgenda width="20" height="20" strokeWidth="2" />
        <span>{dataDeHoje()}</span>
      </div>
      <button className="perfil" type="button" aria-label="Menu do perfil">
        <span className="avatar" aria-hidden="true">{USUARIO.nome[0]}</span>
        <span className="perfil-nome">{USUARIO.nome}</span>
        <SetaBaixo />
      </button>
    </header>
  );
}
