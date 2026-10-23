import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { diaDeHoje, horaAgora } from '../utils/hora.js';
import { Rosto } from './Icones.jsx';

const OPCOES = [
  { valor: 'feliz', rotulo: 'Feliz' },
  { valor: 'irritada', rotulo: 'Irritada' },
  { valor: 'bem', rotulo: 'Bem' },
  { valor: 'animada', rotulo: 'Animada' },
  { valor: 'triste', rotulo: 'Triste' },
];

/* humor do dia, salvo por data */
export default function CardHumor() {
  const [humor, setHumor] = useLocalStorage('humor-' + diaDeHoje(), null);

  return (
    <section className="card card-humor">
      <div className="humor-topo">
        <h2>Como você está hoje?</h2>
        <p className="humor-status" aria-live="polite">{humor ? 'Registrado às ' + humor.hora : ''}</p>
      </div>
      <div className="rostos" role="radiogroup" aria-label="Como você está hoje?">
        {OPCOES.map(({ valor, rotulo }) => (
          <label className="humor-op" key={valor}>
            <input
              type="radio"
              name="humor"
              value={valor}
              checked={humor?.valor === valor}
              onChange={() => setHumor({ valor, hora: horaAgora() })}
            />
            <span className="rosto">
              <Rosto tipo={valor} />
              <small>{rotulo}</small>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
