import { diaSemanaCurto, hoje, intervaloPorExtenso, numeroDoDia, somarDias } from '../utils/datas.js';
import ChipEvento from './ChipEvento.jsx';
import { SetaDireita, SetaEsquerda } from './Icones.jsx';

/* compromissos (não rotina) que marcam o dia na faixa do celular */
const MARCAM_O_DIA = ['consulta', 'exame', 'visita'];

/* Semana em 7 colunas, com os compromissos escritos em cada dia.
   No celular as colunas viram uma faixa de dias e o painel do dia mostra a lista. */
export default function Semana({ dias, selecionado, eventosDoDia, carregado, rotuloTipo, aoSelecionar, aoAbrir }) {
  const dataHoje = hoje();

  return (
    <section className="card quadro semana" aria-labelledby="quadro-titulo">
      <div className="quadro-topo">
        <h2 id="quadro-titulo" aria-live="polite">{intervaloPorExtenso(dias[0], dias[6])}</h2>
        <div className="setas">
          <button type="button" className="btn-icone" aria-label="Semana anterior" onClick={() => aoSelecionar(somarDias(selecionado, -7))}>
            <SetaEsquerda />
          </button>
          <button type="button" className="btn-icone" aria-label="Próxima semana" onClick={() => aoSelecionar(somarDias(selecionado, 7))}>
            <SetaDireita />
          </button>
        </div>
      </div>

      <ol className={'semana-grade' + (carregado ? '' : ' carregando')}>
        {dias.map((data) => {
          const eventos = eventosDoDia(data);
          const tipos = MARCAM_O_DIA.filter((t) => eventos.some((e) => e.tipo === t && e.status !== 'cancelado'));
          const classes = ['semana-dia'];
          if (data === selecionado) classes.push('selecionado');
          if (data === dataHoje) classes.push('hoje');
          if (data < dataHoje) classes.push('passado');
          return (
            <li key={data} className={classes.join(' ')}>
              <button
                type="button"
                className="semana-cabeca"
                onClick={() => aoSelecionar(data)}
                aria-pressed={data === selecionado}
                aria-current={data === dataHoje ? 'date' : undefined}
                aria-label={`${diaSemanaCurto(data)} ${numeroDoDia(data)}, ${eventos.length} itens`}
              >
                <span className="semana-dia-nome">{diaSemanaCurto(data)}</span>
                <span className="semana-dia-num">{numeroDoDia(data)}</span>
                <span className="semana-pontos" aria-hidden="true">
                  {tipos.map((t) => <span key={t} className={'ponto ' + t} />)}
                </span>
              </button>
              <div className="semana-eventos">
                {eventos.map((e) => (
                  <ChipEvento key={e.chave} evento={e} rotuloTipo={rotuloTipo} aoAbrir={aoAbrir} />
                ))}
                {carregado && !eventos.length && <span className="semana-livre">Livre</span>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
