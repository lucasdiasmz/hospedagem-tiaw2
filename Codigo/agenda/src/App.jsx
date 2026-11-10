import { useRef, useState } from 'react';
import Cabecalho from './components/Cabecalho.jsx';
import DialogoDetalhes from './components/DialogoDetalhes.jsx';
import DialogoNovo from './components/DialogoNovo.jsx';
import Mes from './components/Mes.jsx';
import PainelDia from './components/PainelDia.jsx';
import Semana from './components/Semana.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import { useAgenda } from './hooks/useAgenda.js';
import { hoje } from './utils/datas.js';

const MESES_PADRAO = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DIAS_PADRAO = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function App() {
  const agenda = useAgenda();
  const { catalogos } = agenda;

  const [novoAberto, setNovoAberto] = useState(false);
  const [aberto, setAberto] = useState(null);
  const [aviso, setAviso] = useState(null);
  const proximosRef = useRef(null);

  /* rótulos, cores e nomes vêm dos catálogos do banco */
  const tipos = catalogos?.tiposEvento || [];
  const rotuloTipo = (id) => tipos.find((t) => t.id === id)?.rotulo || id;
  const statusInfo = (id) => catalogos?.statusEvento.find((s) => s.id === id) || { id, rotulo: id, cor: '#8b97ad' };
  const [ano, mesNum] = agenda.mes.split('-').map(Number);
  const nomeMes = (catalogos?.meses || MESES_PADRAO)[mesNum - 1] + ' ' + ano;

  function avisar(msg) {
    setAviso({ msg, id: Date.now() });
  }

  async function gravar(acao, msgOk) {
    try {
      await acao();
      avisar(msgOk);
    } catch (e) {
      avisar('Não foi possível salvar: ' + e.message);
    }
  }

  async function salvarNovo(evento) {
    /* erros de validação ficam no formulário (o DialogoNovo mostra a mensagem) */
    await agenda.criar(evento);
    setNovoAberto(false);
    agenda.selecionar(evento.data);
    avisar('Compromisso adicionado');
  }

  function mudarStatus(evento, status) {
    setAberto(null);
    gravar(() => agenda.alterarStatus(evento.eventoId, status), statusInfo(status).rotulo + ': ' + evento.titulo);
  }

  function excluir(evento) {
    setAberto(null);
    gravar(() => agenda.excluir(evento.eventoId), 'Compromisso excluído');
  }

  function verProximos() {
    proximosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    proximosRef.current?.focus({ preventScroll: true });
  }

  const propsQuadro = {
    selecionado: agenda.selecionado,
    eventosDoDia: agenda.eventosDoDia,
    carregado: agenda.carregado,
    rotuloTipo,
    aoSelecionar: agenda.selecionar,
    aoAbrir: setAberto,
  };

  let conteudo;
  if (agenda.erro && !agenda.carregado) {
    conteudo = (
      <div className="card aviso-erro" role="alert">
        <h2>Não foi possível carregar a agenda</h2>
        <p>{agenda.erro}. Verifique se o servidor da agenda está rodando (Codigo/agenda/server).</p>
      </div>
    );
  } else if (!agenda.carregando && !agenda.idosoId) {
    conteudo = (
      <div className="card aviso-erro">
        <h2>Nenhum idoso acompanhado</h2>
        <p>Quando você acompanhar um idoso, a agenda dele aparece aqui.</p>
      </div>
    );
  } else {
    conteudo = (
      <div className="agenda-grade">
        {agenda.visao === 'semana' ? (
          <Semana dias={agenda.semana} {...propsQuadro} />
        ) : (
          <Mes
            mes={agenda.mes}
            nomeMes={nomeMes}
            diasSemana={catalogos?.diasSemanaCurtos || DIAS_PADRAO}
            {...propsQuadro}
          />
        )}

        <PainelDia
          data={agenda.selecionado}
          eventos={agenda.eventosDoDia(agenda.selecionado)}
          carregado={agenda.carregado}
          proximos={agenda.proximos}
          proximosRef={proximosRef}
          rotuloTipo={rotuloTipo}
          statusInfo={statusInfo}
          aoSelecionar={agenda.selecionar}
          aoAbrir={setAberto}
          aoNovo={() => setNovoAberto(true)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="app">
        <Sidebar usuario={agenda.usuario} aoNovoCompromisso={() => setNovoAberto(true)} aoVerProximos={verProximos} />

        <div className="coluna">
          <main className="conteudo">
            <Cabecalho
              usuario={agenda.usuario}
              mes={agenda.mes}
              resumo={agenda.resumo}
              visao={agenda.visao}
              aoMudarVisao={agenda.mudarVisao}
              aoHoje={() => agenda.selecionar(hoje())}
              aoNovo={() => setNovoAberto(true)}
            />
            {conteudo}
          </main>
        </div>
      </div>

      <Toast aviso={aviso} />

      <DialogoNovo
        aberto={novoAberto}
        dataInicial={agenda.selecionado}
        tipos={tipos}
        aoFechar={() => setNovoAberto(false)}
        aoSalvar={salvarNovo}
      />

      <DialogoDetalhes
        evento={aberto}
        rotuloTipo={rotuloTipo}
        statusInfo={statusInfo}
        aoFechar={() => setAberto(null)}
        aoMudarStatus={mudarStatus}
        aoExcluir={excluir}
      />
    </>
  );
}
