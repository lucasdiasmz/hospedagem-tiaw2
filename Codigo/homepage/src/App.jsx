import { useEffect, useRef, useState } from 'react';
import AcoesRapidas from './components/AcoesRapidas.jsx';
import AindaHoje from './components/AindaHoje.jsx';
import CardCompromisso from './components/CardCompromisso.jsx';
import Dialogo from './components/Dialogo.jsx';
import DialogoNota from './components/DialogoNota.jsx';
import Saudacao from './components/Saudacao.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import { useCuidadosDoDia } from './hooks/useCuidadosDoDia.js';
import { duracaoPorExtenso, minutosAte, somarMinutos } from './utils/hora.js';

/* força um novo render a cada minuto, para a contagem regressiva andar */
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

  const [notaAberta, setNotaAberta] = useState(false);
  const [sosAberto, setSosAberto] = useState(false);
  const [novaNotaId, setNovaNotaId] = useState(null);
  const [aviso, setAviso] = useState(null);
  const aindaHojeRef = useRef(null);

  const minutos = proximo ? minutosAte(proximo.hora) : 0;
  let subtitulo = 'Tudo em dia por hoje. Que seu dia seja tranquilo!';
  if (proximo) {
    subtitulo = minutos > 0
      ? 'Seu próximo compromisso é daqui a ' + duracaoPorExtenso(minutos) + '.'
      : 'Está na hora: ' + proximo.titulo + '.';
  }

  /* o item em destaque não se repete na lista de baixo; o que já foi feito sai dela */
  const restantes = cuidados.linhaDoTempo.filter((e) => e.tipo === 'nota' || (!e.status && e.id !== proximo?.id));

  function avisar(msg) {
    setAviso({ msg, id: Date.now() });
  }

  function concluir(item) {
    if (!item) return;
    cuidados.definir(item.id, { status: 'tomei' });
    avisar('Registrado: ' + item.titulo);
  }

  function recusar() {
    if (!proximo) return;
    cuidados.definir(proximo.id, { status: 'recusou' });
    avisar('Recusa registrada: ' + proximo.titulo);
  }

  function adiar() {
    if (!proximo) return;
    const nova = somarMinutos(proximo.hora, 30);
    cuidados.definir(proximo.id, { hora: nova });
    avisar('Adiado para ' + nova);
  }

  function salvarNota(nota) {
    cuidados.adicionarNota(nota);
    setNovaNotaId(nota.id);
    setNotaAberta(false);
    avisar('Anotação salva');
  }

  function verHorarios() {
    aindaHojeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  return (
    <>
      <div className="app">
        <Sidebar
          aoAdicionarCuidado={() => setNotaAberta(true)}
          aoVerHorarios={verHorarios}
          aoAbrirAjuda={() => setSosAberto(true)}
        />

        <div className="coluna">

          <main className="conteudo">
            <Saudacao subtitulo={subtitulo} />
            <CardCompromisso
              item={proximo}
              minutos={minutos}
              aoConcluir={() => concluir(proximo)}
              aoRecusar={recusar}
              aoAdiar={adiar}
            />
            <AcoesRapidas
              med={medAtual}
              aoRegistrarRemedio={() => concluir(medAtual)}
              aoAbrirNota={() => setNotaAberta(true)}
              aoAbrirAjuda={() => setSosAberto(true)}
            />
            <AindaHoje
              secaoRef={aindaHojeRef}
              entradas={restantes}
              novaNotaId={novaNotaId}
              aoConcluir={(id) => concluir(restantes.find((e) => e.id === id))}
              aoRemoverNota={cuidados.removerNota}
            />
          </main>
        </div>
      </div>

      <Toast aviso={aviso} />

      <DialogoNota aberto={notaAberta} aoFechar={() => setNotaAberta(false)} aoSalvar={salvarNota} />

      {/* Confirmação do pedido de ajuda */}
      <Dialogo aberto={sosAberto} aoFechar={() => setSosAberto(false)} tituloId="sos-titulo">
        <h2 id="sos-titulo">Chamar ajuda?</h2>
        <p>A equipe será avisada agora.</p>
        <div className="dialogo-botoes">
          <button type="button" className="btn" onClick={() => setSosAberto(false)}>Cancelar</button>
          <button
            type="button"
            className="btn btn-primario"
            onClick={() => { setSosAberto(false); avisar('Pedido de ajuda enviado à equipe'); }}
          >
            Chamar ajuda
          </button>
        </div>
      </Dialogo>
    </>
  );
}
