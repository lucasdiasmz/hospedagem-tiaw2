import { useEffect, useRef, useState } from 'react';
import Shell from '@ds/Shell.jsx';
import Toast from '@ds/Toast.jsx';
import { AvisoEspera, Estado, PaginaTopo } from '@ds/Componentes.jsx';
import { IconeMais, IconePilula, IconeVoltar } from '@ds/Icones.jsx';
import { TELAS } from '@ds/navegacao.js';
import FormMedicamento from './components/FormMedicamento.jsx';
import ListaMedicamentos from './components/ListaMedicamentos.jsx';
import { IDOSOS, USUARIO } from './data/db.js';
import { criarMedicamento, definirAtivo, editarMedicamento, listarMedicamentos } from './services/api.js';

export default function App() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState('');
  const [idosoId, setIdosoId] = useState(IDOSOS[0].id);
  const [editando, setEditando] = useState(null);
  const [aviso, setAviso] = useState(null);
  const formRef = useRef(null);
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
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function novoMedicamento() {
    setEditando(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    formRef.current?.querySelector('input')?.focus({ preventScroll: true });
  }

  function verCadastrados() {
    listaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const atalhos = [
    { rotulo: 'Novo medicamento', Icone: IconeMais, aoClicar: novoMedicamento },
    { rotulo: 'Ver cadastrados', Icone: IconePilula, aoClicar: verCadastrados },
  ];

  return (
    <Shell tela="medicamentos" permissao="cadastro-medicamentos" usuario={{ nome: USUARIO.nomeCompleto, tipo: 'cuidador' }} atalhos={atalhos}>
      <PaginaTopo
        titulo="Cadastro de medicamentos"
        subtitulo="Registre remédio, dosagem e horários. As doses aparecem na tela de Medicamentos e no Início."
        voltar={<a className="voltar" href={TELAS.medicamentos}><IconeVoltar />Doses de hoje</a>}
      />

      {IDOSOS.length > 1 && (
        <div className="pilulas seletor-idoso" role="radiogroup" aria-label="Para quem é o medicamento">
          {IDOSOS.map((i) => (
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

      <div className="grade">
        <FormMedicamento
          formRef={formRef}
          idoso={idoso}
          categorias={categorias}
          editando={editando}
          aoCancelar={() => setEditando(null)}
          aoSalvar={salvar}
        />
        <ListaMedicamentos
          secaoRef={listaRef}
          idoso={idoso}
          medicamentos={doIdoso}
          carregando={carregando}
          editandoId={editando?.id}
          aoAlternar={alternar}
          aoEditar={editar}
        />
      </div>

      <Toast aviso={aviso} />
    </Shell>
  );
}
