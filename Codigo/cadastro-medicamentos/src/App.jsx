import { useRef, useState } from 'react';
import FormMedicamento from './components/FormMedicamento.jsx';
import ListaMedicamentos from './components/ListaMedicamentos.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import Topbar from './components/Topbar.jsx';
import { IDOSOS, MEDICAMENTOS_INICIAIS } from './data/db.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { proximoId } from './utils/medicamentos.js';

export default function App() {
  /* parte do db.json; o que for cadastrado fica salvo no navegador */
  const [medicamentos, setMedicamentos] = useLocalStorage('acessamob.db.medicamentos', MEDICAMENTOS_INICIAIS);
  const [idosoId, setIdosoId] = useState(IDOSOS[0].id);
  const [aviso, setAviso] = useState(null);
  const nomeRef = useRef(null);
  const listaRef = useRef(null);

  const idoso = IDOSOS.find((i) => i.id === idosoId);
  const doIdoso = medicamentos.filter((m) => m.idosoId === idosoId);
  const categorias = [...new Set(medicamentos.map((m) => m.categoria).filter(Boolean))];

  function avisar(msg) {
    setAviso({ msg, id: Date.now() });
  }

  function cadastrar(med) {
    setMedicamentos((lista) => [...lista, { id: proximoId(lista), ...med }]);
    avisar('Medicamento cadastrado: ' + med.nome);
  }

  function alternar(id) {
    const med = medicamentos.find((m) => m.id === id);
    setMedicamentos((lista) => lista.map((m) => (m.id === id ? { ...m, ativo: !m.ativo } : m)));
    avisar((med.ativo ? 'Desativado: ' : 'Reativado: ') + med.nome);
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

            <div className="grade">
              <FormMedicamento nomeRef={nomeRef} idoso={idoso} categorias={categorias} aoSalvar={cadastrar} />
              <ListaMedicamentos secaoRef={listaRef} idoso={idoso} medicamentos={doIdoso} aoAlternar={alternar} />
            </div>
          </main>
        </div>
      </div>

      <Toast aviso={aviso} />
    </>
  );
}
