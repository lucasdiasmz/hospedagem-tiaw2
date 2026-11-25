import { useEffect, useRef, useState } from 'react';
import Shell from '@ds/Shell.jsx';
import Dialogo from '@ds/Dialogo.jsx';
import Toast from '@ds/Toast.jsx';
import { Estado } from '@ds/Componentes.jsx';
import { IconeAgenda, IconeLapis, IconeMais } from '@ds/Icones.jsx';
import { TELAS } from '@ds/navegacao.js';
import { useUsuario } from '@ds/preferencias.js';
import { usePermissoes } from '@ds/permissoes.js';
import AcoesRapidas from './components/AcoesRapidas.jsx';
import AindaHoje from './components/AindaHoje.jsx';
import CardCompromisso from './components/CardCompromisso.jsx';
import DialogoNota from './components/DialogoNota.jsx';
import Saudacao from './components/Saudacao.jsx';
import { useCuidadosDoDia } from './hooks/useCuidadosDoDia.js';
import { duracaoPorExtenso, horaAgora, minutosAte, somarMinutos } from './utils/hora.js';

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
  const { medAtual, proximo } = cuidados;
  const usuario = useUsuario(cuidados.usuario);
  const { perfil, pode } = usePermissoes();
  /* o idoso vê um início mais simples: o próximo cuidado, pedir ajuda e o resto do dia */
  const simples = perfil === 'idoso';

  const [notaAberta, setNotaAberta] = useState(false);
  const [sosAberto, setSosAberto] = useState(false);
  const [novaNotaId, setNovaNotaId] = useState(null);
  const [aviso, setAviso] = useState(null);
  const aindaHojeRef = useRef(null);

  const minutos = proximo ? minutosAte(proximo.hora) : 0;
  let subtitulo = 'Tudo em dia por hoje. Que seu dia seja tranquilo!';
  if (cuidados.carregando) {
    subtitulo = 'Carregando os cuidados de hoje…';
  } else if (cuidados.erro) {
    subtitulo = 'Não conseguimos carregar os cuidados de hoje.';
  } else if (proximo) {
    subtitulo = minutos > 0
      ? 'Seu próximo cuidado é daqui a ' + duracaoPorExtenso(minutos) + '.'
      : minutos < -15
        ? 'Há um cuidado atrasado: ' + proximo.titulo + '.'
        : 'Está na hora: ' + proximo.titulo + '.';
  }

  /* o item em destaque não se repete na lista de baixo; o que já foi feito sai dela */
  const restantes = cuidados.linhaDoTempo.filter((e) => e.tipo === 'nota' || (!e.status && e.id !== proximo?.id));

  function avisar(msg, tipo) {
    setAviso({ msg, tipo, id: Date.now() });
  }

  /* executa uma gravação no servidor e avisa o resultado */
  async function gravar(acao, msgOk) {
    try {
      await acao();
      avisar(msgOk);
    } catch (e) {
      avisar('Não foi possível salvar: ' + e.message, 'erro');
    }
  }

  function concluir(item) {
    if (!item) return;
    gravar(() => cuidados.definir(item.id, { status: 'feito' }), 'Registrado: ' + item.titulo);
  }

  function recusar() {
    if (!proximo) return;
    gravar(() => cuidados.definir(proximo.id, { status: 'recusou' }), 'Recusa registrada: ' + proximo.titulo);
  }

  /* adia 30 min a partir de agora quando o item já passou (antes, um item das 07:30 adiado
     às 19:30 ia para 08:00 e continuava atrasado) */
  function adiar() {
    if (!proximo) return;
    const base = minutos > 0 ? proximo.hora : horaAgora();
    const nova = somarMinutos(base, 30);
    gravar(() => cuidados.definir(proximo.id, { hora: nova }), 'Adiado para ' + nova);
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
    gravar(cuidados.chamarAjuda, 'Pedido de ajuda enviado à equipe');
  }

  function verHorarios() {
    aindaHojeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const atalhos = [
    pode('inicio.anotar') && { rotulo: 'Nova anotação', Icone: IconeLapis, aoClicar: () => setNotaAberta(true) },
    { rotulo: 'Ver o resto do dia', Icone: IconeAgenda, aoClicar: verHorarios },
    pode('medicamentos.cadastrar') && { rotulo: 'Cadastrar medicamento', Icone: IconeMais, href: TELAS.cadastroMedicamentos },
  ].filter(Boolean);

  return (
    <Shell tela="inicio" usuario={cuidados.usuario} atalhos={atalhos}>
      <Saudacao nome={usuario?.nome} idoso={simples ? null : cuidados.idoso?.nome} subtitulo={subtitulo} />

      {cuidados.carregando && <div className="esqueleto inicio-esqueleto" aria-hidden="true" />}

      {cuidados.erro && (
        <Estado
          tipo="erro"
          titulo="Não foi possível carregar o dia"
          acao={<button type="button" className="btn" onClick={() => window.location.reload()}>Tentar de novo</button>}
        >
          <p>{cuidados.erro}. Confira a conexão; se estiver rodando no computador, veja se a API do início (porta 3001) está ligada.</p>
        </Estado>
      )}

      {!cuidados.carregando && !cuidados.erro && (
        <CardCompromisso
          item={proximo}
          minutos={minutos}
          linhaDoTempo={cuidados.linhaDoTempo}
          simples={simples}
          aoConcluir={() => concluir(proximo)}
          aoRecusar={recusar}
          aoAdiar={adiar}
        />
      )}

      <AcoesRapidas
        med={medAtual}
        aoRegistrarRemedio={() => concluir(medAtual)}
        aoAbrirNota={pode('inicio.anotar') ? () => setNotaAberta(true) : null}
        aoAbrirAjuda={() => setSosAberto(true)}
      />

      {!cuidados.erro && (
        <AindaHoje
          secaoRef={aindaHojeRef}
          entradas={restantes}
          carregando={cuidados.carregando}
          novaNotaId={novaNotaId}
          aoConcluir={(id) => concluir(restantes.find((e) => e.id === id))}
          aoRemoverNota={pode('inicio.anotar') ? removerNota : null}
          aoNovaNota={pode('inicio.anotar') ? () => setNotaAberta(true) : null}
        />
      )}

      <Toast aviso={aviso} />

      <DialogoNota aberto={notaAberta} aoFechar={() => setNotaAberta(false)} aoSalvar={salvarNota} />

      {/* confirmação do pedido de ajuda: protege contra toque sem querer */}
      <Dialogo aberto={sosAberto} aoFechar={() => setSosAberto(false)} titulo="Chamar ajuda agora?"
        descricao="Toda a rede de apoio recebe um aviso de que você precisa de ajuda.">
        <div className="dialogo-botoes">
          <button type="button" className="btn" onClick={() => setSosAberto(false)}>Cancelar</button>
          <button type="button" className="btn btn-perigo" onClick={chamarAjuda}>Sim, chamar ajuda</button>
        </div>
      </Dialogo>
    </Shell>
  );
}
