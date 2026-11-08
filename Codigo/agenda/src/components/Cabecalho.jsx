import { nomeDoMes } from '../utils/datas.js';
import { IconeMais } from './Icones.jsx';

const RESUMO = [
  { tipo: 'consulta', um: 'consulta', varios: 'consultas' },
  { tipo: 'exame', um: 'exame', varios: 'exames' },
  { tipo: 'visita', um: 'visita', varios: 'visitas' },
  { tipo: 'medicamento', um: 'remédio em uso', varios: 'remédios em uso' },
];

const VISOES = [
  { id: 'semana', rotulo: 'Semana' },
  { id: 'mes', rotulo: 'Mês' },
];

/* título, idoso acompanhado, resumo do mês em uma linha e ações principais */
export default function Cabecalho({ idosos, idosoId, aoTrocarIdoso, mes, resumo, visao, aoMudarVisao, aoHoje, aoNovo }) {
  const idoso = idosos.find((i) => i.id === idosoId);

  return (
    <header className="cabecalho">
      <div className="cabecalho-titulo">
        <div className="cabecalho-linha">
          <h1>Agenda</h1>
          {idosos.length > 1 ? (
            <label className="seletor-idoso">
              <span className="sr-only">Agenda de</span>
              <select value={idosoId || ''} onChange={(e) => aoTrocarIdoso(e.target.value)}>
                {idosos.map((i) => <option key={i.id} value={i.id}>{i.apelido || i.nome}</option>)}
              </select>
            </label>
          ) : idoso && <span className="nome-idoso">{idoso.apelido || idoso.nome}</span>}
        </div>

        <p className="resumo-linha" aria-live="polite">
          <span className="resumo-mes">Em {nomeDoMes(mes)}</span>
          {RESUMO.map(({ tipo, um, varios }) => {
            const n = resumo?.[tipo];
            return (
              <span key={tipo} className={'resumo-item ' + tipo + (n === 0 ? ' zerado' : '')}>
                <span className="ponto" aria-hidden="true"></span>
                <strong>{n ?? '–'}</strong> {n === 1 ? um : varios}
              </span>
            );
          })}
        </p>
      </div>

      <div className="cabecalho-acoes">
        <div className="alternar-visao" role="group" aria-label="Visualização">
          {VISOES.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={visao === v.id}
              onClick={() => aoMudarVisao(v.id)}
            >
              {v.rotulo}
            </button>
          ))}
        </div>
        <button type="button" className="btn-secundario" onClick={aoHoje}>Hoje</button>
        <button type="button" className="btn-novo" onClick={aoNovo} aria-label="Novo compromisso">
          <IconeMais strokeWidth="2.2" />
          <span>Novo compromisso</span>
        </button>
      </div>
    </header>
  );
}
