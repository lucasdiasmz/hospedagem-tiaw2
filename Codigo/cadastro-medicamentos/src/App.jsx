import { useEffect, useRef, useState } from 'react';
import Shell from '@ds/Shell.jsx';
import Toast from '@ds/Toast.jsx';
import { AvisoEspera, Estado, PaginaTopo } from '@ds/Componentes.jsx';
import { IconeVoltar } from '@ds/Icones.jsx';
import { TELAS } from '@ds/navegacao.js';
import FormMedicamento from './components/FormMedicamento.jsx';
import ListaMedicamentos from './components/ListaMedicamentos.jsx';
import { criarMedicamento, definirAtivo, editarMedicamento, listarIdosos, listarMedicamentos } from './services/api.js';

export default function App() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState('');
  const [idosos, setIdosos] = useState([]);
  const [idosoId, setIdosoId] = useState(null);
  const [editando, setEditando] = useState(null);
  const [aviso, setAviso] = useState(null);
  const formRef = useRef(null);
  /* no celular, o formulário e a lista se alternam em abas */
  const [aba, setAba] = useState('novo');

  const idoso = idosos.find((i) => i.id === idosoId);
  const doIdoso = medicamentos.filter((m) => m.idosoId === idosoId);
  const categorias = [...new Set(medicamentos.map((m) => m.categoria).filter(Boolean))];

  useEffect(() => {
    Promise.all([listarIdosos(), listarMedicamentos()])
      .then(([meus, lista]) => {
        setIdosos(meus);
        setIdosoId(meus[0]?.id || null);
        setMedicamentos(lista);
        setErroApi('');
      })
      .catch((e) => setErroApi(e.message))
      .finally(() => setCarregando(false));
  }, []);

  function avisar(msg, tipo) {
    setAviso({ msg, tipo, id: Date.now() });
  }

  /* devolve true quando salvou, para o formulário saber se pode limpar os campos */
  async function salvar(med) {
    try {
      if (editando) {
        const atualizado = await editarMedicamento(editando.id, med);
        setMedicamentos((lista) => lista.map((m) => (m.id === atualizado.id ? atualizado : m)));
        avisar('Alterações salvas: ' + atualizado.nome);
        setEditando(null);
        setAba('lista');
      } else {
        const criado = await criarMedicamento(med);
        setMedicamentos((lista) => [...lista, criado]);
        avisar('Medicamento cadastrado: ' + criado.nome);
      }
      return true;
    } catch (e) {
      avisar('Não foi possível salvar: ' + e.message, 'erro');
      return false;
    }
  }

  async function alternar(id) {
    const med = medicamentos.find((m) => m.id === id);
    try {
      const atualizado = await definirAtivo(id, !med.ativo);
      setMedicamentos((lista) => lista.map((m) => (m.id === id ? atualizado : m)));
      avisar((atualizado.ativo ? 'Reativado: ' : 'Pausado: ') + med.nome);
    } catch (e) {
      avisar('Não foi possível salvar: ' + e.message, 'erro');
    }
  }

  function editar(med) {
    setEditando(med);
    setAba('novo');
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  }

  return (
    <Shell tela="medicamentos" permissao="cadastro-medicamentos">
      <PaginaTopo
        titulo="Cadastro de medicamentos"
        subtitulo="As doses aparecem na tela de Medicamentos e no Início."
      >
        <a className="btn btn-suave" href={TELAS.medicamentos}><IconeVoltar />Doses de hoje</a>
      </PaginaTopo>

      {idosos.length > 1 && (
        <div className="pilulas seletor-idoso" role="radiogroup" aria-label="Para quem é o medicamento">
          {idosos.map((i) => (
            <button key={i.id} type="button" role="radio" className="pilula" aria-checked={i.id === idosoId}
              onClick={() => { setIdosoId(i.id); setEditando(null); }}>
              {i.nome}
            </button>
          ))}
        </div>
      )}

      <AvisoEspera ativo={carregando} />
      {erroApi && (
        <Estado tipo="erro" titulo="Não foi possível carregar"
          acao={<button type="button" className="btn" onClick={() => window.location.reload()}>Tentar de novo</button>}>
          <p>{erroApi}</p>
        </Estado>
      )}

      {!carregando && !erroApi && !idoso && (
        <Estado titulo="Nenhuma pessoa vinculada ainda"
          acao={<a className="btn btn-primario" href={TELAS.inicio}>Ir para o Início</a>}>
          <p>Cadastre a pessoa ou use um código de convite no Início.</p>
        </Estado>
      )}

      {idoso && <div className={'grade grade--' + aba}>
        <div className="segmentado abas-cadastro" role="group" aria-label="Mostrar">
          <button type="button" aria-pressed={aba === 'novo'} onClick={() => setAba('novo')}>{editando ? 'Editar' : 'Novo'}</button>
          <button type="button" aria-pressed={aba === 'lista'} onClick={() => setAba('lista')}>Cadastrados</button>
        </div>
        <FormMedicamento
          formRef={formRef}
          idoso={idoso}
          categorias={categorias}
          editando={editando}
          aoCancelar={() => setEditando(null)}
          aoSalvar={salvar}
        />
        <ListaMedicamentos
          idoso={idoso}
          medicamentos={doIdoso}
          carregando={carregando}
          editandoId={editando?.id}
          aoAlternar={alternar}
          aoEditar={editar}
        />
      </div>}

      <Toast aviso={aviso} />
    </Shell>
  );
}
