import { useRef, useState } from 'react';
import CardCuidados from './components/CardCuidados.jsx';
import CardHumor from './components/CardHumor.jsx';
import CardRemedio from './components/CardRemedio.jsx';
import Dialogo from './components/Dialogo.jsx';
import DialogoNota from './components/DialogoNota.jsx';
import Saudacao from './components/Saudacao.jsx';
import Sidebar from './components/Sidebar.jsx';
import Timeline from './components/Timeline.jsx';
import Toast from './components/Toast.jsx';
import Topbar from './components/Topbar.jsx';
import { useCuidadosDoDia } from './hooks/useCuidadosDoDia.js';
import { somarMinutos } from './utils/hora.js';

export default function App() {
  const cuidados = useCuidadosDoDia();
  const { medAtual } = cuidados;

  const [busca, setBusca] = useState('');
  const [notaAberta, setNotaAberta] = useState(false);
  const [sosAberto, setSosAberto] = useState(false);
  const [novaNotaId, setNovaNotaId] = useState(null);
  const [aviso, setAviso] = useState(null);
  const timelineRef = useRef(null);

  function avisar(msg) {
    setAviso({ msg, id: Date.now() });
  }

  function tomar() {
    if (!medAtual) return;
    cuidados.definir(medAtual.id, { status: 'tomei' });
    avisar('Registrado: ' + medAtual.titulo);
  }

  function recusar() {
    if (!medAtual) return;
    cuidados.definir(medAtual.id, { status: 'recusou' });
    avisar('Recusa registrada: ' + medAtual.titulo);
  }

  function adiar() {
    if (!medAtual) return;
    const nova = somarMinutos(medAtual.hora, 30);
    cuidados.definir(medAtual.id, { hora: nova });
    avisar('Adiado para ' + nova);
  }

  function salvarNota(nota) {
    cuidados.adicionarNota(nota);
    setNovaNotaId(nota.id);
    setNotaAberta(false);
    avisar('Anotação salva');
  }

  function verHorarios() {
    timelineRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
          <Topbar busca={busca} aoBuscar={setBusca} aoAbrirAjuda={() => setSosAberto(true)} />

          <main className="conteudo">
            {/* Coluna principal */}
            <div className="col-esq">
              <Saudacao />
              <CardRemedio med={medAtual} aoTomar={tomar} aoRecusar={recusar} aoAdiar={adiar} />
              <Timeline
                secaoRef={timelineRef}
                entradas={cuidados.linhaDoTempo}
                proximoId={cuidados.proximo?.id}
                busca={busca}
                novaNotaId={novaNotaId}
                aoAlternar={cuidados.alternar}
                aoRemoverNota={cuidados.removerNota}
                aoAbrirNota={() => setNotaAberta(true)}
              />
            </div>

            {/* Coluna lateral */}
            <div className="col-dir">
              <CardCuidados contagem={cuidados.contagem} />
              <CardHumor />
            </div>
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
