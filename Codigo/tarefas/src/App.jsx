import { useCallback, useEffect, useRef, useState } from 'react';
import DivisaoCuidado from './components/DivisaoCuidado.jsx';
import FormTarefa from './components/FormTarefa.jsx';
import ListaCompras from './components/ListaCompras.jsx';
import ListaTarefas from './components/ListaTarefas.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import Topbar from './components/Topbar.jsx';
import { IDOSOS, membrosDaRede } from './data/db.js';
import { criarTarefa, listarTarefas, marcarComprados, mudarStatus } from './services/api.js';
import { ABAS } from './utils/tarefas.js';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState('');
  const [idosoId, setIdosoId] = useState(IDOSOS[0].id);
  const [aba, setAba] = useState('a_fazer');
  const [criando, setCriando] = useState(false);
  const [aviso, setAviso] = useState(null);
  const comprasRef = useRef(null);

  const idoso = IDOSOS.find((i) => i.id === idosoId);
  const membros = membrosDaRede(idosoId);
  const doIdoso = tarefas.filter((t) => t.idosoId === idosoId);

  useEffect(() => {
    listarTarefas()
      .then((lista) => { setTarefas(lista); setErroApi(''); })
      .catch((e) => setErroApi(e.message))
      .finally(() => setCarregando(false));
  }, []);

  function avisar(msg) {
    setAviso({ msg, id: Date.now() });
  }

  function trocar(atualizada) {
    setTarefas((lista) => lista.map((t) => (t.id === atualizada.id ? atualizada : t)));
  }

  /* devolve true quando salvou, para o formulário saber se pode fechar */
  async function cadastrar(tarefa) {
    try {
      const criada = await criarTarefa(tarefa);
      setTarefas((lista) => [...lista, criada]);
      setAba('a_fazer');
      avisar('Tarefa criada: ' + criada.titulo);
      return true;
    } catch (e) {
      avisar(e.message);
      return false;
    }
  }

  async function alterarStatus(tarefa, status) {
    try {
      trocar(await mudarStatus(tarefa.id, status));
      const destino = ABAS.find((a) => a.status === status).rotulo;
      avisar('"' + tarefa.titulo + '" foi para ' + destino);
    } catch (e) {
      avisar(e.message);
    }
  }

  /* porTarefa: { "trd-2": [0, 2] } */
  async function comprar(porTarefa) {
    try {
      const atualizadas = await Promise.all(
        Object.entries(porTarefa).map(([id, indices]) => marcarComprados(id, indices)),
      );
      atualizadas.forEach(trocar);
      const concluidas = atualizadas.filter((t) => t.status === 'concluido').length;
      avisar(concluidas ? 'Itens comprados. Compra concluída!' : 'Itens marcados como comprados.');
      return true;
    } catch (e) {
      avisar(e.message);
      return false;
    }
  }

  const fecharForm = useCallback(() => setCriando(false), []);

  function verCompras() {
    comprasRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <div className="app">
        <Sidebar aoNovaTarefa={() => setCriando(true)} aoVerCompras={verCompras} />

        <div className="coluna">
          <Topbar />

          <main className="conteudo">
            <header className="titulo-pagina">
              <h1>Tarefas da rede de apoio</h1>
              <p>Divida os cuidados entre a família e os cuidadores, sem sobrecarregar ninguém.</p>
              <label className="seletor-idoso">
                Idoso
                <select value={idosoId} onChange={(e) => setIdosoId(e.target.value)}>
                  {IDOSOS.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
                </select>
              </label>
            </header>

            {erroApi && <p className="aviso-erro" role="alert">{erroApi}</p>}

            <div className="grade">
              <ListaTarefas
                tarefas={doIdoso}
                membros={membros}
                carregando={carregando}
                aba={aba}
                aoMudarAba={setAba}
                aoMudarStatus={alterarStatus}
                aoCriar={() => setCriando(true)}
              />
              <div className="coluna-lateral">
                <ListaCompras key={idosoId} secaoRef={comprasRef} tarefas={doIdoso} aoComprar={comprar} />
                <DivisaoCuidado membros={membros} tarefas={doIdoso} />
              </div>
            </div>
          </main>
        </div>
      </div>

      {criando && (
        <FormTarefa
          idoso={idoso}
          membros={membros}
          tarefas={doIdoso}
          aoSalvar={cadastrar}
          aoFechar={fecharForm}
        />
      )}

      <Toast aviso={aviso} />
    </>
  );
}
