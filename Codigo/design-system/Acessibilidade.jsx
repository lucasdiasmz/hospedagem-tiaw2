import { IconeContraste, IconeLetra } from './Icones.jsx';
import { usePreferencias } from './preferencias.js';

/* Letra maior e alto contraste: dois botões lado a lado, sempre à vista (menu e boas-vindas) */
export default function Acessibilidade() {
  const [prefs, salvar] = usePreferencias();
  return (
    <div className="acess" role="group" aria-label="Acessibilidade">
      <button type="button" className="acess-botao" aria-pressed={prefs.fonteMaior} onClick={() => salvar({ fonteMaior: !prefs.fonteMaior })}>
        <IconeLetra />
        <span>Letra maior</span>
      </button>
      <button type="button" className="acess-botao" aria-pressed={prefs.altoContraste} onClick={() => salvar({ altoContraste: !prefs.altoContraste })}>
        <IconeContraste />
        <span>Alto contraste</span>
      </button>
    </div>
  );
}
