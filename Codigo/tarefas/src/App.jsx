import { useCallback, useEffect, useRef, useState } from 'react';
import Shell from '@ds/Shell.jsx';
import Toast from '@ds/Toast.jsx';
import { Estado, PaginaTopo } from '@ds/Componentes.jsx';
import { IconeMais } from '@ds/Icones.jsx';
import DivisaoCuidado from './components/DivisaoCuidado.jsx';
import FormTarefa from './components/FormTarefa.jsx';
import ListaCompras from './components/ListaCompras.jsx';
import ListaTarefas from './components/ListaTarefas.jsx';
import { IconeCarrinho } from './components/Icones.jsx';
import { IDOSOS, USUARIO, membrosDaRede } from './data/db.js';
import { criarTarefa, listarTarefas, marcarComprados, mudarStatus } from './services/api.js';
import { ABAS } from './utils/tarefas.js';
import { usePermissoes } from '@ds/permissoes.js';

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
  /* familiar vê e cria todas; cuidador vê só as tarefas em que é o responsável */
  const { pode } = usePermissoes();
  const podeCriar = pode('tarefas.criar');
  const doIdoso = tarefas.filter((t) => t.idosoId === idosoId && (pode('tarefas.todas') || t.responsavelId === USUARIO.id));
  const pendentes = doIdoso.filter((t) => t.status !== 'concluido').length;

  useEffect(() => {
    listarTarefas()
      .then((lista) => { setTarefas(lista); setErroApi(''); })
      .catch((e) => setErroApi(e.message))
      .finally(() => setCarregando(false));
  }, []);

  function avisar(msg, tipo) {
    setAviso({ msg, tipo, id: Date.now() });
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
      avisar('Não foi possível salvar: ' + e.message, 'erro');
      return false;
    }
  }

  async function alterarStatus(tarefa, status) {
    try {
      trocar(await mudarStatus(tarefa.id, status));
      const destino = ABAS.find((a) => a.status === status).rotulo;
      avisar('“' + tarefa.titulo + '” foi para ' + destino);
    } catch (e) {
      avisar('Não foi possível salvar: ' + e.message, 'erro');
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
      avisar('Não foi possível salvar: ' + e.message, 'erro');
      return false;
    }
  }

  const fecharForm = useCallback(() => setCriando(false), []);

  function verCompras() {
    comprasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const atalhos = [
    podeCriar && { rotulo: 'Nova tarefa', Icone: IconeMais, aoClicar: () => setCriando(true) },
    { rotulo: 'Lista de compras', Icone: IconeCarrinho, aoClicar: verCompras },
  ].filter(Boolean);

  return (
    <Shell tela="tarefas" usuario={{ nome: USUARIO.nomeCompleto, tipo: 'cuidador' }} atalhos={atalhos}>
      <PaginaTopo
        titulo="Tarefas da rede"
        subtitulo={carregando
          ? 'Divida os cuidados entre a família e os cuidadores, sem sobrecarregar ninguém.'
          : (pendentes === 1 ? '1 tarefa em aberto' : pendentes + ' tarefas em aberto') + ' para ' + idoso.apelido + '.'}
      >
        {podeCriar && (
          <button type="button" className="btn btn-primario botao-nova" onClick={() => setCriando(true)}>
            <IconeMais />
            Nova tarefa
          </button>
        )}
      </PaginaTopo>

      {IDOSOS.length > 1 && (
        <div className="pilulas seletor-idoso" role="radiogroup" aria-label="Tarefas de">
          {IDOSOS.map((i) => (
            <button key={i.id} type="button" role="radio" className="pilula" aria-checked={i.id === idosoId} aria-pressed={i.id === idosoId}
              onClick={() => setIdosoId(i.id)}>
              {i.nome}
            </button>
          ))}
        </div>
      )}

      {erroApi && (
        <Estado tipo="erro" titulo="Não foi possível falar com a API">
          <p>{erroApi} No computador, a API das tarefas roda na porta 3004.</p>
        </Estado>
      )}

      <div className="grade">
        <ListaTarefas
          tarefas={doIdoso}
          membros={membros}
          carregando={carregando}
          aba={aba}
          aoMudarAba={setAba}
          aoMudarStatus={alterarStatus}
        />
        <div className="coluna-lateral">
          <ListaCompras key={idosoId} secaoRef={comprasRef} tarefas={doIdoso} aoComprar={comprar} />
          <DivisaoCuidado membros={membros} tarefas={doIdoso} />
        </div>
      </div>

      {podeCriar && (
        <button type="button" className="fab" onClick={() => setCriando(true)}>
          <IconeMais />
          Nova tarefa
        </button>
      )}

      {criando && podeCriar && (
        <FormTarefa
          idoso={idoso}
          membros={membros}
          tarefas={doIdoso}
          aoSalvar={cadastrar}
          aoFechar={fecharForm}
        />
      )}

      <Toast aviso={aviso} />
    </Shell>
  );
}
