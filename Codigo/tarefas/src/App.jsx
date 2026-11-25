import { useCallback, useEffect, useState } from 'react';
import Shell from '@ds/Shell.jsx';
import Toast from '@ds/Toast.jsx';
import { AvisoEspera, Estado, PaginaTopo } from '@ds/Componentes.jsx';
import { IconeMais } from '@ds/Icones.jsx';
import { TELAS } from '@ds/navegacao.js';
import DivisaoCuidado from './components/DivisaoCuidado.jsx';
import FormTarefa from './components/FormTarefa.jsx';
import ListaCompras from './components/ListaCompras.jsx';
import ListaTarefas from './components/ListaTarefas.jsx';
import { criarTarefa, listarIdosos, listarTarefas, marcarComprados, mudarStatus } from './services/api.js';
import { ABAS } from './utils/tarefas.js';
import { usePermissoes } from '@ds/permissoes.js';

/* no celular só um painel aparece por vez; no computador as tarefas ficam sempre à vista e, sem
   largura para os três, as compras e a divisão se alternam ao lado */
const PAINEIS = [
  { id: 'tarefas', rotulo: 'Tarefas' },
  { id: 'compras', rotulo: 'Compras' },
  { id: 'divisao', rotulo: 'Divisão' },
];

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState('');
  const [idosos, setIdosos] = useState([]);
  const [eu, setEu] = useState(null);
  const [idosoId, setIdosoId] = useState(null);
  const [aba, setAba] = useState('a_fazer');
  const [criando, setCriando] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [painel, setPainel] = useState('tarefas');

  const idoso = idosos.find((i) => i.id === idosoId);
  const membros = idoso?.membros || [];
  /* familiar vê e cria todas; cuidador vê só as tarefas em que é o responsável */
  const { pode } = usePermissoes();
  const podeCriar = pode('tarefas.criar') && Boolean(idoso);
  const doIdoso = tarefas.filter((t) => t.idosoId === idosoId && (pode('tarefas.todas') || t.responsavelId === eu));
  const pendentes = doIdoso.filter((t) => t.status !== 'concluido').length;

  useEffect(() => {
    Promise.all([listarIdosos(), listarTarefas()])
      .then(([rede, lista]) => {
        setEu(rede.eu);
        setIdosos(rede.idosos);
        setIdosoId(rede.idosos[0]?.id || null);
        setTarefas(lista);
        setErroApi('');
      })
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

  return (
    <Shell tela="tarefas">
      <PaginaTopo
        titulo="Tarefas da rede"
        subtitulo={!idoso
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

      {idosos.length > 1 && (
        <div className="pilulas seletor-idoso" role="radiogroup" aria-label="Tarefas de">
          {idosos.map((i) => (
            <button key={i.id} type="button" role="radio" className="pilula" aria-checked={i.id === idosoId}
              onClick={() => setIdosoId(i.id)}>
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

      {(carregando || idoso) && <div className={'grade grade--' + painel}>
        <div className="segmentado paineis" role="group" aria-label="Mostrar">
          {PAINEIS.map((p) => (
            <button key={p.id} type="button" className={'ver-' + p.id} aria-pressed={painel === p.id} onClick={() => setPainel(p.id)}>
              {p.rotulo}
            </button>
          ))}
        </div>
        <ListaTarefas
          tarefas={doIdoso}
          membros={membros}
          carregando={carregando}
          aba={aba}
          aoMudarAba={setAba}
          aoMudarStatus={alterarStatus}
        />
        <div className="coluna-lateral">
          <ListaCompras key={idosoId} tarefas={doIdoso} podeCriar={podeCriar} aoComprar={comprar} />
          {/* a divisão conta a rede inteira, senão cada perfil vê uma porcentagem */}
          <DivisaoCuidado membros={membros} tarefas={tarefas.filter((t) => t.idosoId === idosoId)} />
        </div>
      </div>}

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
