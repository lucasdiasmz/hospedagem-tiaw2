import { useEffect, useRef, useState } from 'react';
import FormMedicamento from './components/FormMedicamento.jsx';
import ListaMedicamentos from './components/ListaMedicamentos.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import Topbar from './components/Topbar.jsx';
import { IDOSOS } from './data/db.js';
import { criarMedicamento, definirAtivo, listarMedicamentos } from './services/api.js';

export default function App() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState('');
  const [idosoId, setIdosoId] = useState(IDOSOS[0].id);
  const [aviso, setAviso] = useState(null);
  const nomeRef = useRef(null);
  const listaRef = useRef(null);

  const idoso = IDOSOS.find((i) => i.id === idosoId);
  const doIdoso = medicamentos.filter((m) => m.idosoId === idosoId);
  const categorias = [...new Set(medicamentos.map((m) => m.categoria).filter(Boolean))];

  useEffect(() => {
    listarMedicamentos()
      .then((lista) => { setMedicamentos(lista); setErroApi(''); })
      .catch((e) => setErroApi(e.message))
      .finally(() => setCarregando(false));
  }, []);

  function avisar(msg) {
    setAviso({ msg, id: Date.now() });
  }

  /* devolve true quando salvou, para o formulário saber se pode limpar os campos */
  async function cadastrar(med) {
    try {
      const criado = await criarMedicamento(med);
      setMedicamentos((lista) => [...lista, criado]);
      avisar('Medicamento cadastrado: ' + criado.nome);
      return true;
    } catch (e) {
      avisar(e.message);
      return false;
    }
  }

  async function alternar(id) {
    const med = medicamentos.find((m) => m.id === id);
    try {
      const atualizado = await definirAtivo(id, !med.ativo);
      setMedicamentos((lista) => lista.map((m) => (m.id === id ? atualizado : m)));
      avisar((atualizado.ativo ? 'Reativado: ' : 'Desativado: ') + med.nome);
    } catch (e) {
      avisar(e.message);
    }
  }

  function novoMedicamento() {
    nomeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    nomeRef.current.focus({ preventScroll: true });
  }

  function verCadastrados() {
    listaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <div className="app">
        <Sidebar aoNovoMedicamento={novoMedicamento} aoVerCadastrados={verCadastrados} />

        <div className="coluna">
          <Topbar />

          <main className="conteudo">
            <header className="titulo-pagina">
              <h1>Cadastro de medicamentos</h1>
              <p>Registre os remédios, as dosagens e os horários para que ninguém esqueça de nenhuma dose.</p>
              <label className="seletor-idoso">
                Idoso
                <select value={idosoId} onChange={(e) => setIdosoId(e.target.value)}>
                  {IDOSOS.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
                </select>
              </label>
            </header>

            {erroApi && <p className="aviso-erro" role="alert">{erroApi}</p>}

            <div className="grade">
              <FormMedicamento nomeRef={nomeRef} idoso={idoso} categorias={categorias} aoSalvar={cadastrar} />
              <ListaMedicamentos
                secaoRef={listaRef}
                idoso={idoso}
                medicamentos={doIdoso}
                carregando={carregando}
                aoAlternar={alternar}
              />
            </div>
          </main>
        </div>
      </div>

      <Toast aviso={aviso} />
    </>
  );
}
