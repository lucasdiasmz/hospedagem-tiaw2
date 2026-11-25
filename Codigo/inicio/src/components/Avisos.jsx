import { useState } from 'react';
import { TELAS } from '@ds/navegacao.js';
import { IconeAgenda, IconeCheck, IconeFechar, IconeSos } from '@ds/Icones.jsx';

const SERVICOS = { acompanhante: 'Acompanhante', 'tecnico-enfermagem': 'Técnico de enfermagem', companhia: 'Companhia', outro: 'Atendimento' };

const primeiro = (nome) => (nome || '').trim().split(/\s+/)[0];
const hora = (iso = '') => iso.slice(11, 16);
const dia = (data = '') => data.split('-').reverse().slice(0, 2).join('/');

/* botão que mostra "Enviando…" enquanto a resposta vai para o servidor */
function Botao({ classe = 'btn', aoClicar, children }) {
  const [enviando, setEnviando] = useState(false);
  async function clicar() {
    setEnviando(true);
    try {
      await aoClicar();
    } finally {
      setEnviando(false);
    }
  }
  return <button type="button" className={classe} onClick={clicar} disabled={enviando}>{enviando ? 'Enviando…' : children}</button>;
}

function Fechar({ aoClicar }) {
  return (
    <button type="button" className="btn-icone aviso-fechar" aria-label="Dispensar aviso" onClick={aoClicar}>
      <IconeFechar />
    </button>
  );
}

/* pedido de ajuda: para quem pediu, mostra a resposta; para a rede, pede uma ação */
function Chamado({ c, simples, aoResponder, aoDispensar }) {
  const quem = primeiro(c.abertoPorNome) || 'Alguém';
  const indo = primeiro(c.indoPorNome);

  if (c.meu) {
    const titulo = c.status === 'atendido'
      ? 'Pedido de ajuda resolvido'
      : c.status === 'a-caminho' ? `${indo} está indo até ${simples ? 'você' : primeiro(c.idosoNome)}` : 'Pedido de ajuda enviado';
    const texto = c.status === 'atendido'
      ? `Encerrado por ${primeiro(c.atendidoPorNome) || 'alguém da rede'}.`
      : c.status === 'a-caminho' ? 'A rede de apoio já viu o seu pedido.' : `Enviado às ${hora(c.dataHora)}. A rede de apoio recebeu o aviso.`;
    return (
      <li className={'aviso aviso--' + (c.status === 'atendido' ? 'ok' : 'ajuda')}>
        <span className="aviso-icone" aria-hidden="true">{c.status === 'atendido' ? <IconeCheck /> : <IconeSos />}</span>
        <div className="aviso-texto">
          <strong>{titulo}</strong>
          <p>{texto}</p>
        </div>
        {c.status === 'atendido'
          ? <Fechar aoClicar={aoDispensar} />
          : <div className="aviso-acoes"><Botao aoClicar={() => aoResponder('resolvido')}>{simples ? 'Já estou bem' : 'Encerrar pedido'}</Botao></div>}
      </li>
    );
  }

  return (
    <li className="aviso aviso--ajuda">
      <span className="aviso-icone" aria-hidden="true"><IconeSos /></span>
      <div className="aviso-texto">
        <strong>{quem === primeiro(c.idosoNome) ? `${quem} pediu ajuda` : `${quem} pediu ajuda para ${primeiro(c.idosoNome)}`}</strong>
        <p>
          <time>{hora(c.dataHora)}</time>
          {c.mensagem && <> · {c.mensagem}</>}
          {c.status === 'a-caminho' && <> · {c.euVou ? 'Você avisou que está indo.' : `${indo} está indo.`}</>}
        </p>
      </div>
      <div className="aviso-acoes">
        {c.status === 'aberto' && <Botao classe="btn btn-perigo" aoClicar={() => aoResponder('indo')}>Estou indo</Botao>}
        <Botao aoClicar={() => aoResponder('resolvido')}>Resolvido</Botao>
      </div>
    </li>
  );
}

/* solicitação de atendimento: o cuidador responde; a família acompanha */
function Solicitacao({ s, aoResponder, aoDispensar }) {
  const servico = SERVICOS[s.servico] || 'Atendimento';
  const quando = `${dia(s.data)}, ${s.horaInicio} às ${s.horaFim}`;

  if (s.recebida) {
    return (
      <li className="aviso aviso--pedido">
        <span className="aviso-icone" aria-hidden="true"><IconeAgenda /></span>
        <div className="aviso-texto">
          <strong>{primeiro(s.familiaNome) || 'Uma família'} pediu atendimento para {primeiro(s.idosoNome)}</strong>
          <p>{servico} · {quando}{s.mensagem && <> · “{s.mensagem}”</>}</p>
        </div>
        <div className="aviso-acoes">
          <Botao classe="btn btn-primario" aoClicar={() => aoResponder(true)}>Aceitar</Botao>
          <Botao aoClicar={() => aoResponder(false)}>Recusar</Botao>
        </div>
      </li>
    );
  }

  const cuidador = primeiro(s.cuidadorNome) || 'O cuidador';
  const textos = {
    pendente: [`Pedido enviado para ${cuidador}`, `${servico} · ${quando}. Você recebe a resposta aqui.`],
    aceita: [`${cuidador} aceitou o atendimento`, `${cuidador} entrou na rede de apoio de ${primeiro(s.idosoNome)} e já vê os cuidados do dia.`],
    recusada: [`${cuidador} não pode atender`, 'Procure outro cuidador disponível para esse horário.'],
  };
  const [titulo, texto] = textos[s.status] || textos.pendente;
  return (
    <li className={'aviso aviso--' + (s.status === 'aceita' ? 'ok' : 'pedido')}>
      <span className="aviso-icone" aria-hidden="true">{s.status === 'aceita' ? <IconeCheck /> : <IconeAgenda />}</span>
      <div className="aviso-texto">
        <strong>{titulo}</strong>
        <p>{texto}</p>
      </div>
      {s.status === 'recusada' && <div className="aviso-acoes"><a className="btn" href={TELAS.cuidadores}>Ver cuidadores</a></div>}
      <Fechar aoClicar={aoDispensar} />
    </li>
  );
}

/* Avisos da rede de apoio, no topo do Início. Só aparece quando há algo. */
export default function Avisos({ avisos, simples, aoErro }) {
  const { chamados, solicitacoes } = avisos;
  if (!chamados.length && !solicitacoes.length) return null;

  const tentar = (acao) => async (...args) => {
    try {
      await acao(...args);
    } catch (e) {
      aoErro(e.message);
    }
  };

  return (
    <section className="avisos" aria-labelledby="avisos-titulo" aria-live="polite">
      <h2 id="avisos-titulo" className="somente-leitor">Avisos</h2>
      <ul className="avisos-lista">
        {chamados.map((c) => (
          <Chamado key={c.id} c={c} simples={simples}
            aoResponder={tentar((acao) => avisos.responderChamado(c, acao))} aoDispensar={() => avisos.dispensar(c.id)} />
        ))}
        {solicitacoes.map((s) => (
          <Solicitacao key={s.id} s={s}
            aoResponder={tentar((aceitar) => avisos.responderSolicitacao(s, aceitar))} aoDispensar={() => avisos.dispensar(s.id)} />
        ))}
      </ul>
    </section>
  );
}
