import { TELAS } from '@ds/navegacao.js';
import { IconeCheck } from '@ds/Icones.jsx';
import { pad } from '../utils/hora.js';
import { ICONES_TIPO, NOMES_TIPO } from './Icones.jsx';

/* "há 1h40", "daqui a 20 min" */
function tempo(min) {
  if (min < 60) return min + ' min';
  const m = min % 60;
  return Math.floor(min / 60) + 'h' + (m ? pad(m) : '');
}

function situacao(minutos) {
  if (minutos < -15) return { tipo: 'atrasado', texto: 'Atrasado há ' + tempo(-minutos) };
  if (minutos <= 0) return { tipo: 'agora', texto: 'Está na hora' };
  return { tipo: 'depois', texto: 'Daqui a ' + tempo(minutos) };
}

/* o que fazer agora: a hora grande, o nome do cuidado e os botões para resolvê-lo.
   Sem nada pendente, vira um aviso calmo de dia resolvido ou de dia sem cuidados. */
export default function Agora({ item, minutos, total, simples, podeAgenda, aoConcluir, aoRecusar, aoAdiar }) {
  if (!item) {
    const resolvido = total > 0;
    return (
      <section className="agora agora--livre" aria-labelledby="agora-titulo">
        <span className="agora-selo" aria-hidden="true"><IconeCheck /></span>
        <div className="agora-livre-texto">
          <h2 id="agora-titulo">{resolvido ? 'Tudo feito por hoje' : 'Nada marcado para hoje'}</h2>
          <p>
            {resolvido
              ? (total === 1 ? 'O cuidado de hoje foi resolvido.' : `Os ${total} cuidados de hoje foram resolvidos.`)
              : 'Remédios, consultas e tarefas marcados na agenda aparecem aqui na hora certa.'}
          </p>
        </div>
        {!resolvido && podeAgenda && <a className="btn" href={TELAS.agenda}>Abrir agenda</a>}
      </section>
    );
  }

  const s = situacao(minutos);
  const ehMed = item.tipo === 'med';

  return (
    <section className={'agora sobre-escuro agora--' + s.tipo} aria-labelledby="agora-titulo">
      <div className="agora-topo">
        <div className="agora-quando">
          <time className="agora-hora">{item.hora}</time>
          <p className="agora-situacao">{s.texto}</p>
        </div>

        <div className="agora-oque">
          <h2 id="agora-titulo">{item.titulo}</h2>
          <p className="agora-tipo">
            {ICONES_TIPO[item.tipo]}
            <span>{NOMES_TIPO[item.tipo]}</span>
            {item.detalhe && item.detalhe !== NOMES_TIPO[item.tipo] && <span className="agora-detalhe">{item.detalhe}</span>}
          </p>
        </div>
      </div>

      <div className="agora-acoes">
        <button type="button" className="btn btn-claro" onClick={aoConcluir}>
          <IconeCheck />
          {ehMed ? (simples ? 'Já tomei' : 'Já tomou') : 'Marcar como feito'}
        </button>
        {!simples && ehMed && <button type="button" className="btn btn-contorno" onClick={aoRecusar}>Recusou</button>}
        {!simples && <button type="button" className="btn btn-contorno" onClick={aoAdiar}>Adiar 30 min</button>}
      </div>
    </section>
  );
}
