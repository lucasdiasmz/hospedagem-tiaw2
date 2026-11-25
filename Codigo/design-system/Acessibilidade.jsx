import { IconeContraste, IconeLetra } from './Icones.jsx';
import { usePreferencias } from './preferencias.js';

const OPCOES = [
  { id: 'fonteMaior', rotulo: 'Letra maior', Icone: IconeLetra },
  { id: 'altoContraste', rotulo: 'Alto contraste', Icone: IconeContraste },
];

/* Letra maior e alto contraste, sempre à vista: no menu são linhas com chave;
   nas boas-vindas ("compacta"), dois botões lado a lado */
export default function Acessibilidade({ compacta = false }) {
  const [prefs, salvar] = usePreferencias();
  return (
    <div className={compacta ? 'acess acess--compacta' : 'acess'} role="group" aria-label="Acessibilidade">
      {OPCOES.map(({ id, rotulo, Icone }) => {
        const ligado = Boolean(prefs[id]);
        const estado = compacta ? { 'aria-pressed': ligado } : { role: 'switch', 'aria-checked': ligado };
        return (
          <button key={id} type="button" className="acess-botao" {...estado} onClick={() => salvar({ [id]: !ligado })}>
            <Icone />
            <span>{rotulo}</span>
            {!compacta && <span className="chave" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
