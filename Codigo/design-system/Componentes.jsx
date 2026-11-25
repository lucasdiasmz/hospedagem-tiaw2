import { useEffect, useState } from 'react';
import { IconeAlerta } from './Icones.jsx';

/* Título da tela: h1, frase de apoio e ações (botões) que vão para a direita no computador */
export function PaginaTopo({ titulo, subtitulo, children, voltar }) {
  return (
    <header className="pagina-topo">
      <div className="pagina-topo-texto">
        {voltar}
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      {children && <div className="pagina-topo-acoes">{children}</div>}
    </header>
  );
}

/* aparece quando o carregamento demora (as APIs gratuitas dormem e levam até 30 s para acordar) */
export function AvisoEspera({ ativo = true, apos = 4000 }) {
  const [demorou, setDemorou] = useState(false);
  useEffect(() => {
    setDemorou(false);
    if (!ativo) return;
    const timer = setTimeout(() => setDemorou(true), apos);
    return () => clearTimeout(timer);
  }, [ativo, apos]);
  return (
    <p className="aviso-espera" role="status">
      {ativo && demorou ? 'Está demorando mais que o normal. Pode levar até 30 segundos.' : ''}
    </p>
  );
}

/* Carregando, erro e vazio no mesmo formato em todas as telas */
export function Estado({ tipo = 'vazio', titulo, children, acao }) {
  if (tipo === 'carregando') {
    return (
      <div className="estado estado--carregando" role="status">
        <span className="girando" aria-hidden="true" />
        <p>{titulo || 'Carregando…'}</p>
        <AvisoEspera />
      </div>
    );
  }
  return (
    <div className={'estado estado--' + tipo} role={tipo === 'erro' ? 'alert' : undefined}>
      {tipo === 'erro' && <IconeAlerta />}
      {titulo && <h2>{titulo}</h2>}
      {children && <div className="estado-texto">{children}</div>}
      {acao}
    </div>
  );
}

/* "HH:MM" → minutos do dia */
function minutos(hora) {
  const [h, m] = String(hora).split(':').map(Number);
  return h * 60 + (m || 0);
}

/* Régua do dia: a assinatura visual do AcessaMob. Uma faixa de 6h às 22h (ou maior, se
   houver itens fora disso) com cada cuidado marcado no seu horário e a agulha do "agora".
   Mostra o dia de relance; a lista acessível com os mesmos itens fica na própria tela,
   então a régua é decorativa para leitores de tela.
   itens: [{ id, hora: 'HH:MM', titulo, tipo, status: 'feito' | 'recusou' | 'atrasado' | null }] */
export function ReguaDoDia({ itens = [], agora, claro = false }) {
  const valores = itens.map((i) => minutos(i.hora));
  const inicio = Math.min(6 * 60, ...valores.map((v) => Math.floor(v / 60) * 60));
  const fim = Math.max(22 * 60, ...valores.map((v) => Math.ceil((v + 1) / 60) * 60));
  const total = fim - inicio;
  const pos = (v) => ((v - inicio) / total) * 100 + '%';
  const marcas = [];
  for (let h = Math.ceil(inicio / 60); h * 60 <= fim; h += 3) marcas.push(h);
  const agoraMin = agora ? minutos(agora) : null;

  return (
    <div className={'regua' + (claro ? ' regua--clara' : '')} aria-hidden="true">
      <div className="regua-trilho">
        {agoraMin !== null && agoraMin >= inicio && agoraMin <= fim && (
          <span className="regua-passado" style={{ width: pos(agoraMin) }} />
        )}
        {itens.map((i) => (
          <span
            key={i.id}
            className={'regua-ponto tipo-' + i.tipo + (i.status ? ' ' + i.status : '')}
            style={{ left: pos(minutos(i.hora)) }}
            title={i.hora + ' · ' + i.titulo}
          />
        ))}
        {agoraMin !== null && agoraMin >= inicio && agoraMin <= fim && (
          <span className="regua-agora" style={{ left: pos(agoraMin) }}><span>{agora}</span></span>
        )}
      </div>
      <div className="regua-horas">
        {marcas.map((h) => (
          <span key={h} style={{ left: pos(h * 60) }}>{String(h).padStart(2, '0')}h</span>
        ))}
      </div>
    </div>
  );
}
