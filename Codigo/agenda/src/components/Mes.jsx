import { gradeDoMes, hoje, numeroDoDia, somarMeses } from '../utils/datas.js';
import ChipEvento from './ChipEvento.jsx';
import { SetaDireita, SetaEsquerda } from './Icones.jsx';

const ROTINA = ['medicamento', 'tarefa'];
const MAX_CHIPS = 2;

/* Mês em grade: cada dia mostra até 2 compromissos escritos; a rotina (remédios e tarefas)
   vira uma contagem, porque acontece quase todo dia. */
export default function Mes({ mes, nomeMes, diasSemana, selecionado, eventosDoDia, carregado, rotuloTipo, aoSelecionar, aoAbrir }) {
  const dataHoje = hoje();

  function irPara(novoMes) {
    aoSelecionar(dataHoje.startsWith(novoMes) ? dataHoje : novoMes + '-01');
  }

  return (
    <section className="card quadro mes" aria-labelledby="quadro-titulo">
      <div className="quadro-topo">
        <h2 id="quadro-titulo" aria-live="polite">{nomeMes}</h2>
        <div className="setas">
          <button type="button" className="btn-icone" aria-label="Mês anterior" onClick={() => irPara(somarMeses(mes, -1))}>
            <SetaEsquerda />
          </button>
          <button type="button" className="btn-icone" aria-label="Próximo mês" onClick={() => irPara(somarMeses(mes, 1))}>
            <SetaDireita />
          </button>
        </div>
      </div>

      <ol className="mes-semana" aria-hidden="true">
        {diasSemana.map((d, i) => <li key={i}>{d}</li>)}
      </ol>

      <ol className={'mes-grade' + (carregado ? '' : ' carregando')}>
        {gradeDoMes(mes).map(({ data, fora }) => {
          if (fora) return <li key={data} className="mes-dia fora" aria-hidden="true"><span className="mes-num">{numeroDoDia(data)}</span></li>;

          const eventos = eventosDoDia(data);
          const destaque = eventos.filter((e) => !ROTINA.includes(e.tipo));
          const rotina = eventos.length - destaque.length;
          const extras = destaque.length - MAX_CHIPS;
          const classes = ['mes-dia'];
          if (data === selecionado) classes.push('selecionado');
          if (data === dataHoje) classes.push('hoje');
          if (data < dataHoje) classes.push('passado');

          return (
            <li key={data} className={classes.join(' ')}>
              <button
                type="button"
                className="mes-cabeca"
                onClick={() => aoSelecionar(data)}
                aria-pressed={data === selecionado}
                aria-current={data === dataHoje ? 'date' : undefined}
                aria-label={`Dia ${numeroDoDia(data)}, ${eventos.length} itens`}
              >
                <span className="mes-num">{numeroDoDia(data)}</span>
              </button>
              {destaque.slice(0, MAX_CHIPS).map((e) => (
                <ChipEvento key={e.chave} evento={e} rotuloTipo={rotuloTipo} aoAbrir={aoAbrir} />
              ))}
              {(extras > 0 || rotina > 0) && (
                <button type="button" className="mes-mais" onClick={() => aoSelecionar(data)}>
                  {[extras > 0 && `+${extras}`, rotina > 0 && `${rotina} de rotina`].filter(Boolean).join(' · ')}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
