import { ReguaDoDia } from '@ds/Componentes.jsx';
import { IconeCheck, IconeRelogio } from '@ds/Icones.jsx';
import { horaAgora, pad } from '../utils/hora.js';
import { ICONES_TIPO, IconeDespertador, IconeSinoTocando, NOMES_TIPO } from './Icones.jsx';

/* contagem regressiva: "em 30 min", "em 2h15"; na hora ou atrasado vira ícone */
function contador(minutos) {
  if (minutos < -15) {
    const atraso = -minutos;
    const texto = atraso < 60 ? atraso + ' min' : Math.floor(atraso / 60) + 'h' + (atraso % 60 ? pad(atraso % 60) : '');
    return { alerta: 'atrasado', topo: 'Atrasado', base: 'há ' + texto };
  }
  if (minutos <= 0) return { alerta: 'agora', topo: 'É agora', base: '' };
  if (minutos < 60) return { topo: 'Em', valor: String(minutos), base: minutos === 1 ? 'minuto' : 'minutos' };
  const m = minutos % 60;
  return { topo: 'Em', valor: Math.floor(minutos / 60) + 'h' + (m ? pad(m) : ''), base: m ? '' : 'horas' };
}

/* status de cada item na régua do dia */
function paraRegua(linhaDoTempo, agora) {
  return linhaDoTempo.map((e) => ({
    id: e.id,
    hora: e.hora,
    titulo: e.titulo || e.texto,
    tipo: e.tipo,
    status: e.status || (e.tipo !== 'nota' && e.hora < agora ? 'atrasado' : null),
  }));
}

/* destaque do próximo item pendente do dia (remédio, consulta, visita ou tarefa),
   com a régua do dia embaixo mostrando tudo o que já passou e o que vem */
export default function CardCompromisso({ item, minutos, linhaDoTempo, simples, aoConcluir, aoRecusar, aoAdiar }) {
  const agora = horaAgora();
  const regua = <ReguaDoDia itens={paraRegua(linhaDoTempo, agora)} agora={agora} />;
  const feitos = linhaDoTempo.filter((e) => e.status === 'feito').length;
  const total = linhaDoTempo.filter((e) => e.tipo !== 'nota').length;

  if (!item) {
    return (
      <section className="destaque sobre-escuro destaque--vazio" aria-labelledby="destaque-titulo">
        <div className="destaque-corpo">
          <div className="destaque-texto">
            <p className="destaque-rotulo">Próximo cuidado</p>
            <h2 id="destaque-titulo">Tudo em dia</h2>
            <p className="destaque-info">
              {total ? `Os ${total} cuidados de hoje foram resolvidos.` : 'Não há cuidados marcados para hoje.'}
            </p>
          </div>
        </div>
        {total > 0 && regua}
      </section>
    );
  }

  const c = contador(minutos);
  const ehMed = item.tipo === 'med';

  return (
    <section className={"destaque sobre-escuro" + (c.alerta ? ' destaque--' + c.alerta : '')} aria-labelledby="destaque-titulo">
      <div className="destaque-corpo">
        <div className="contador" aria-hidden="true">
          <span className="contador-topo">{c.topo}</span>
          {c.alerta ? (
            <span className="contador-icone">{c.alerta === 'atrasado' ? <IconeDespertador /> : <IconeSinoTocando />}</span>
          ) : (
            <span className="contador-valor">{c.valor}</span>
          )}
          {c.base && <span className="contador-base">{c.base}</span>}
        </div>

        <div className="destaque-texto">
          <p className="destaque-rotulo">
            <IconeRelogio />
            <span>{c.alerta === 'atrasado' ? 'Cuidado atrasado' : 'Próximo cuidado'} · <time>{item.hora}</time></span>
          </p>
          <h2 id="destaque-titulo">{item.titulo}</h2>
          <p className="destaque-info">
            <span className="destaque-tipo">{ICONES_TIPO[item.tipo]}{NOMES_TIPO[item.tipo]}</span>
            {item.detalhe && item.detalhe !== NOMES_TIPO[item.tipo] && <span>{item.detalhe}</span>}
          </p>
        </div>
      </div>

      <div className="destaque-acoes">
        <button type="button" className="btn btn-claro" onClick={aoConcluir}>
          <IconeCheck />
          {ehMed ? (simples ? 'Já tomei' : 'Já tomou') : 'Marcar como feito'}
        </button>
        {!simples && <div className="destaque-sec">
          {ehMed && <button type="button" className="btn btn-contorno" onClick={aoRecusar}>Recusou</button>}
          <button type="button" className="btn btn-contorno" onClick={aoAdiar}>Adiar 30 min</button>
        </div>}
      </div>

      <div className="destaque-dia">
        <p><strong>{feitos}</strong> de {total} cuidados feitos hoje</p>
        {regua}
      </div>
    </section>
  );
}
