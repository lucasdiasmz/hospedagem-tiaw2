import { IconeMais } from '@ds/Icones.jsx';
import { nomeDoMes } from '../utils/datas.js';

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

/* título, idoso acompanhado (antes mostrava o nome do usuário logado), resumo do mês e ações */
export default function Cabecalho({ idoso, mes, resumo, visao, aoMudarVisao, aoHoje, aoNovo }) {
  return (
    <header className="cabecalho">
      <div className="cabecalho-titulo">
        <h1>Agenda</h1>
        <p className="cabecalho-sub">
          {idoso ? <>Compromissos de <strong>{idoso.nome}</strong></> : 'Compromissos da semana e do mês'}
        </p>
        <ul className="resumo-linha" aria-label={'Resumo de ' + nomeDoMes(mes)} aria-live="polite">
          {RESUMO.map(({ tipo, um, varios }) => {
            const n = resumo?.[tipo];
            return (
              <li key={tipo} className={'resumo-item ' + tipo + (n === 0 ? ' zerado' : '')}>
                <span className="ponto" aria-hidden="true"></span>
                <strong>{n ?? '–'}</strong> {n === 1 ? um : varios}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="cabecalho-acoes">
        <div className="segmentado" role="group" aria-label="Visualização">
          {VISOES.map((v) => (
            <button key={v.id} type="button" aria-pressed={visao === v.id} onClick={() => aoMudarVisao(v.id)}>
              {v.rotulo}
            </button>
          ))}
        </div>
        <button type="button" className="btn" onClick={aoHoje}>Hoje</button>
        <button type="button" className="btn btn-primario btn-novo" onClick={aoNovo}>
          <IconeMais />
          Novo compromisso
        </button>
      </div>
    </header>
  );
}
