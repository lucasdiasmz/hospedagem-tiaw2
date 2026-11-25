import { useEffect, useState } from 'react';
import Shell from '@ds/Shell.jsx';
import Dialogo from '@ds/Dialogo.jsx';
import Toast from '@ds/Toast.jsx';
import { AvisoEspera, Estado } from '@ds/Componentes.jsx';
import { IconeCheck, IconePerfis, IconeTelefone } from '@ds/Icones.jsx';
import { useUsuario } from '@ds/preferencias.js';
import { NOMES_PERFIL, usePermissoes } from '@ds/permissoes.js';
import Agora from './components/Agora.jsx';
import Apoio from './components/Apoio.jsx';
import DiaDeHoje from './components/DiaDeHoje.jsx';
import DialogoNota from './components/DialogoNota.jsx';
import { DialogoCodigo, DialogoConvite, SemIdoso } from './components/Rede.jsx';
import Saudacao from './components/Saudacao.jsx';
import { useCuidadosDoDia } from './hooks/useCuidadosDoDia.js';
import { horaAgora, minutosAte, somarMinutos } from './utils/hora.js';

const primeiro = (nome = '') => nome.trim().split(/\s+/)[0].toLowerCase();

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
  const [codigoAberto, setCodigoAberto] = useState(false);
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
    const quem = usuario?.nome ? `Pedido feito por ${usuario.nome} (${NOMES_PERFIL[perfil]})` : undefined;
    gravar(() => cuidados.chamarAjuda(quem?.slice(0, 200)), 'Pedido de ajuda enviado à equipe');
  }

  /* quem é o contato principal não precisa de um botão para ligar para si mesmo */
  const contato = [...(cuidados.idoso?.contatos || [])]
    .sort((a, b) => Number(!!b.principal) - Number(!!a.principal))
    .find((c) => c.telefone && primeiro(c.nome) !== primeiro(usuario?.nome));

  const atalhos = [
    pode('rede.convidar') && { rotulo: 'Convidar para a rede', Icone: IconePerfis, aoClicar: () => setConviteAberto(true) },
    { rotulo: 'Usar código de convite', Icone: IconeCheck, aoClicar: () => setCodigoAberto(true) },
  ].filter(Boolean);

  if (!cuidados.carregando && !cuidados.erro && !cuidados.idoso) {
    return (
      <Shell tela="inicio" usuario={cuidados.usuario}>
        <Saudacao nome={usuario?.nome} subtitulo="Falta só vincular a pessoa cuidada." />
        <SemIdoso perfil={perfil} />
      </Shell>
    );
  }

  const podeAgenda = podeVer('agenda');
  const pronto = !cuidados.carregando && !cuidados.erro;

  return (
    <Shell tela="inicio" usuario={cuidados.usuario} atalhos={atalhos}>
      <Saudacao nome={usuario?.nome} idoso={simples ? null : cuidados.idoso?.nome} subtitulo={subtitulo} />

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
          aoAbrirAjuda={() => setSosAberto(true)}
          aoAbrirNota={pode('inicio.anotar') ? () => setNotaAberta(true) : null}
          aoConvidar={pode('rede.convidar') ? () => setConviteAberto(true) : null}
          aoUsarCodigo={() => setCodigoAberto(true)}
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
      <DialogoCodigo aberto={codigoAberto} aoFechar={() => setCodigoAberto(false)} />

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
