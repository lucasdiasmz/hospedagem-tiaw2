import { useRef, useState } from 'react';
import FormMedicamento from './components/FormMedicamento.jsx';
import ListaMedicamentos from './components/ListaMedicamentos.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import Topbar from './components/Topbar.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';

export default function App() {
  const [medicamentos, setMedicamentos] = useLocalStorage('acessamob.medicamentos', []);
  const [aviso, setAviso] = useState(null);
  const nomeRef = useRef(null);
  const listaRef = useRef(null);

  function avisar(msg) {
    setAviso({ msg, id: Date.now() });
  }

  function cadastrar(med) {
    setMedicamentos((lista) => [...lista, med]);
    avisar('Medicamento cadastrado: ' + med.nome);
  }

  function remover(id) {
    const med = medicamentos.find((m) => m.id === id);
    setMedicamentos((lista) => lista.filter((m) => m.id !== id));
    if (med) avisar('Removido: ' + med.nome);
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
            </header>

            <div className="grade">
              <FormMedicamento nomeRef={nomeRef} aoSalvar={cadastrar} />
              <ListaMedicamentos secaoRef={listaRef} medicamentos={medicamentos} aoRemover={remover} />
            </div>
          </main>
        </div>
      </div>

      <Toast aviso={aviso} />
    </>
  );
}
