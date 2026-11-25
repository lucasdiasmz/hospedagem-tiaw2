import { useCallback, useEffect, useState } from 'react';
import Shell from '@ds/Shell.jsx';
import Dialogo from '@ds/Dialogo.jsx';
import Toast from '@ds/Toast.jsx';
import { AvisoEspera, Estado } from '@ds/Componentes.jsx';
import { IconeCheck, IconePerfis, IconeTelefone } from '@ds/Icones.jsx';
import { useUsuario } from '@ds/preferencias.js';
import { usePermissoes } from '@ds/permissoes.js';
import Agora from './components/Agora.jsx';
import Apoio from './components/Apoio.jsx';
import Avisos from './components/Avisos.jsx';
import DialogoRede from './components/DialogoRede.jsx';
import DiaDeHoje from './components/DiaDeHoje.jsx';
import DialogoNota from './components/DialogoNota.jsx';
import { DialogoCodigo, DialogoConvite, SemIdoso } from './components/Rede.jsx';
import Saudacao from './components/Saudacao.jsx';
import { api } from './api.js';
import { useAvisos } from './hooks/useAvisos.js';
import { useCuidadosDoDia } from './hooks/useCuidadosDoDia.js';
import { horaAgora, minutosAte, somarMinutos } from './utils/hora.js';

const primeiro = (nome = '') => nome.trim().split(/\s+/)[0].toLowerCase();

/* código de convite que veio pelo link (?convite=ABCD-EFGH); sai do endereço depois de lido */
function lerConviteDoEndereco() {
  const q = new URLSearchParams(window.location.search);
  const codigo = q.get('convite') || '';
  if (codigo) {
    q.delete('convite');
    q.delete('perfil');
    const resto = q.toString();
    window.history.replaceState(null, '', window.location.pathname + (resto ? '?' + resto : ''));
  }
  return codigo.slice(0, 12);
}

/* quem está na rede do idoso escolhido */
function useRede(idosoId) {
  const [rede, setRede] = useState([]);
  const carregar = useCallback(async () => {
    if (!idosoId) return setRede([]);
    try {
      setRede(await api(`/idosos/${idosoId}/rede`));
    } catch {
      setRede([]);
    }
  }, [idosoId]);
  useEffect(() => {
    carregar();
  }, [carregar]);
  return [rede, carregar];
}

/* força um novo render a cada 30 s, para a contagem regressiva e a régua andarem */
function useMinutoAtual() {
  const [, setTique] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTique((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);
}

export default function App() {
  useMinutoAtual();
  const cuidados = useCuidadosDoDia();
  const { proximo } = cuidados;
  const usuario = useUsuario(cuidados.usuario);
  const { perfil, pode, podeVer } = usePermissoes();
  /* o idoso vê um início mais simples: o próximo cuidado, pedir ajuda e o resto do dia */
  const simples = perfil === 'idoso';

  const [notaAberta, setNotaAberta] = useState(false);
  const [sosAberto, setSosAberto] = useState(false);
  const [conviteAberto, setConviteAberto] = useState(false);
  const [codigoConvite] = useState(lerConviteDoEndereco);
  const [codigoAberto, setCodigoAberto] = useState(Boolean(codigoConvite));
  const [redeAberta, setRedeAberta] = useState(false);
  const avisos = useAvisos();
  const [rede, carregarRede] = useRede(cuidados.idoso?.id);
  const [novaNotaId, setNovaNotaId] = useState(null);
  const [aviso, setAviso] = useState(null);

  const minutos = proximo ? minutosAte(proximo.hora) : 0;
  const agora = horaAgora();
  const cuidadosHoje = cuidados.linhaDoTempo.filter((e) => e.tipo !== 'nota');
  const feitos = cuidadosHoje.filter((e) => e.status).length;
  const atrasados = cuidadosHoje.filter((e) => !e.status && e.hora < agora).length;

  /* o resumo do dia em uma frase; o detalhe fica no cartão e na lista */
  let subtitulo = 'Nenhum cuidado marcado para hoje.';
  if (cuidados.carregando) {
    subtitulo = 'Carregando os cuidados de hoje…';
  } else if (cuidados.erro) {
    subtitulo = 'Não conseguimos carregar os cuidados de hoje.';
  } else if (cuidadosHoje.length) {
    const faltam = cuidadosHoje.length - feitos;
    subtitulo = !faltam
      ? 'Todos os cuidados de hoje foram feitos.'
      : `${feitos} de ${cuidadosHoje.length} cuidados feitos` + (atrasados ? `, ${atrasados} ${atrasados === 1 ? 'atrasado' : 'atrasados'}.` : '.');
  }

  function avisar(msg, tipo, acao) {
    setAviso({ msg, tipo, acao, id: Date.now() });
  }

  /* executa uma gravação no servidor e avisa o resultado; com "desfazer", o aviso oferece voltar atrás */
  async function gravar(acao, msgOk, desfazer) {
    try {
      await acao();
      avisar(msgOk, undefined, desfazer && {
        rotulo: 'Desfazer',
        aoClicar: () => gravar(desfazer, 'Registro desfeito'),
      });
    } catch (e) {
      avisar('Não foi possível salvar: ' + e.message, 'erro');
    }
  }

  function concluir(item) {
    if (!item) return;
    gravar(() => cuidados.definir(item.id, { status: 'feito' }), 'Registrado: ' + item.titulo,
      () => cuidados.definir(item.id, { status: null }));
  }

  function recusar() {
    if (!proximo) return;
    gravar(() => cuidados.definir(proximo.id, { status: 'recusou' }), 'Recusa registrada: ' + proximo.titulo,
      () => cuidados.definir(proximo.id, { status: null }));
  }

  /* adia 30 min a partir de agora quando o item já passou (antes, um item das 07:30 adiado
     às 19:30 ia para 08:00 e continuava atrasado) */
  function adiar() {
    if (!proximo) return;
    const base = minutos > 0 ? proximo.hora : horaAgora();
    const nova = somarMinutos(base, 30);
    const anterior = proximo.hora === proximo.horarioPrevisto ? null : proximo.hora;
    gravar(() => cuidados.definir(proximo.id, { hora: nova }), 'Adiado para ' + nova,
      () => cuidados.definir(proximo.id, { hora: anterior }));
  }

  function salvarNota(nota) {
    gravar(async () => {
      const salva = await cuidados.adicionarNota(nota);
      setNovaNotaId(salva.id);
      setNotaAberta(false);
    }, 'Anotação salva');
  }

  function removerNota(id) {
    gravar(() => cuidados.removerNota(id), 'Anotação removida');
  }

  function chamarAjuda() {
    setSosAberto(false);
    gravar(async () => {
      await cuidados.chamarAjuda();
      await avisos.carregar();
    }, 'Pedido de ajuda enviado à rede de apoio');
  }

  /* aceitar uma solicitação coloca o cuidador na rede de mais uma pessoa */
  const avisosDaTela = {
    ...avisos,
    async responderSolicitacao(s, aceitar) {
      await avisos.responderSolicitacao(s, aceitar);
      avisar(aceitar ? `Pronto: você agora acompanha ${s.idosoNome.split(' ')[0]}` : 'Solicitação recusada');
      if (aceitar) await cuidados.recarregar();
    },
  };

  async function removerDaRede(membro) {
    await api(`/idosos/${cuidados.idoso.id}/rede/${membro.id}`, { metodo: 'DELETE' });
    if (membro.id === cuidados.usuario?.id) {
      setRedeAberta(false);
      avisar('Você saiu da rede de ' + cuidados.idoso.nome.split(' ')[0]);
      await cuidados.recarregar();
    } else {
      avisar(membro.nome.split(' ')[0] + ' saiu da rede');
      await carregarRede();
    }
  }

  function abrirConvite() {
    setRedeAberta(false);
    setConviteAberto(true);
  }

  function abrirCodigo() {
    setRedeAberta(false);
    setCodigoAberto(true);
  }

  /* quem é o contato principal não precisa de um botão para ligar para si mesmo */
  const contato = [...(cuidados.idoso?.contatos || [])]
    .sort((a, b) => Number(!!b.principal) - Number(!!a.principal))
    .find((c) => c.telefone && primeiro(c.nome) !== primeiro(usuario?.nome));

  const atalhos = [
    { rotulo: 'Rede de apoio', Icone: IconePerfis, aoClicar: () => setRedeAberta(true) },
    { rotulo: 'Usar código de convite', Icone: IconeCheck, aoClicar: () => setCodigoAberto(true) },
  ].filter(Boolean);

  if (!cuidados.carregando && !cuidados.erro && !cuidados.idoso) {
    return (
      <Shell tela="inicio" usuario={cuidados.usuario}>
        <Saudacao nome={usuario?.nome} subtitulo={perfil === 'cuidador' ? 'Você ainda não acompanha ninguém.' : 'Falta só vincular a pessoa cuidada.'} />
        <Avisos avisos={avisosDaTela} simples={simples} aoErro={(m) => avisar(m, 'erro')} />
        <SemIdoso perfil={perfil} codigo={codigoConvite} />
        <Toast aviso={aviso} />
      </Shell>
    );
  }

  const podeAgenda = podeVer('agenda');
  const pronto = !cuidados.carregando && !cuidados.erro;

  return (
    <Shell tela="inicio" usuario={cuidados.usuario} atalhos={atalhos}>
      <Saudacao nome={usuario?.nome} idoso={simples ? null : cuidados.idoso} idosos={cuidados.idosos}
        aoEscolherIdoso={cuidados.escolherIdoso} subtitulo={subtitulo} />

      <Avisos avisos={avisosDaTela} simples={simples} aoErro={(m) => avisar(m, 'erro')} />

      <AvisoEspera ativo={cuidados.carregando} />
      {cuidados.carregando && <div className="esqueleto inicio-esqueleto" aria-hidden="true" />}

      {cuidados.erro && (
        <Estado
          tipo="erro"
          titulo="Não foi possível carregar o dia"
          acao={<button type="button" className="btn" onClick={() => window.location.reload()}>Tentar de novo</button>}
        >
          <p>{cuidados.erro}. Confira a internet e tente de novo.</p>
        </Estado>
      )}

      {pronto && (
        <Agora
          item={proximo}
          minutos={minutos}
          total={cuidadosHoje.length}
          simples={simples}
          podeAgenda={podeAgenda}
          aoConcluir={() => concluir(proximo)}
          aoRecusar={recusar}
          aoAdiar={adiar}
        />
      )}

      {!cuidados.erro && (
        <Apoio
          idoso={cuidados.idoso}
          contato={contato}
          simples={simples}
          rede={rede}
          euId={cuidados.usuario?.id}
          aoAbrirAjuda={() => setSosAberto(true)}
          aoAbrirNota={pode('inicio.anotar') ? () => setNotaAberta(true) : null}
          aoConvidar={pode('rede.convidar') ? () => setConviteAberto(true) : null}
          aoVerRede={() => setRedeAberta(true)}
        />
      )}

      {!cuidados.erro && (cuidados.carregando || cuidados.linhaDoTempo.length > 0) && (
        <DiaDeHoje
          entradas={cuidados.linhaDoTempo}
          agora={agora}
          proximoId={proximo?.id}
          carregando={cuidados.carregando}
          novaNotaId={novaNotaId}
          podeAgenda={podeAgenda}
          aoConcluir={(id) => concluir(cuidados.linhaDoTempo.find((e) => e.id === id))}
          aoRemoverNota={pode('inicio.anotar') ? removerNota : null}
        />
      )}

      <Toast aviso={aviso} />

      <DialogoConvite aberto={conviteAberto} aoFechar={() => setConviteAberto(false)} idoso={cuidados.idoso} />
      <DialogoCodigo aberto={codigoAberto} aoFechar={() => setCodigoAberto(false)} inicial={codigoConvite} />
      <DialogoRede aberto={redeAberta} aoFechar={() => setRedeAberta(false)} idoso={cuidados.idoso} rede={rede}
        euId={cuidados.usuario?.id} perfil={perfil} aoRemover={removerDaRede}
        aoConvidar={pode('rede.convidar') ? abrirConvite : null} aoUsarCodigo={abrirCodigo} />

      <DialogoNota aberto={notaAberta} aoFechar={() => setNotaAberta(false)} aoSalvar={salvarNota} />

      {/* confirmação do pedido de ajuda: protege contra toque sem querer */}
      <Dialogo aberto={sosAberto} aoFechar={() => setSosAberto(false)} titulo="Chamar ajuda agora?"
        descricao={cuidados.idoso
          ? 'A rede de apoio de ' + cuidados.idoso.nome + ' recebe um aviso. Em emergência, ligue para o SAMU.'
          : 'Em emergência, ligue para o SAMU.'}>
        <div className="ajuda-ligar">
          <a className="btn" href="tel:192"><IconeTelefone />SAMU 192</a>
          {contato && (
            <a className="btn" href={'tel:' + contato.telefone.replace(/\D/g, '')}>
              <IconeTelefone />Ligar para {contato.nome.split(' ')[0]}
            </a>
          )}
        </div>
        <div className="dialogo-botoes">
          <button type="button" className="btn" onClick={() => setSosAberto(false)}>Cancelar</button>
          <button type="button" className="btn btn-perigo" onClick={chamarAjuda} disabled={!cuidados.idoso}>Sim, chamar ajuda</button>
        </div>
      </Dialogo>
    </Shell>
  );
}
