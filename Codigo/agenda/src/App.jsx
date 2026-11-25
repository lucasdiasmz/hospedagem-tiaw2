import { useRef, useState } from 'react';
import Cabecalho from './components/Cabecalho.jsx';
import DialogoDetalhes from './components/DialogoDetalhes.jsx';
import DialogoNovo from './components/DialogoNovo.jsx';
import Mes from './components/Mes.jsx';
import PainelDia from './components/PainelDia.jsx';
import Semana from './components/Semana.jsx';
import Shell from '@ds/Shell.jsx';
import Toast from '@ds/Toast.jsx';
import { Estado } from '@ds/Componentes.jsx';
import { IconeAgenda, IconeMais } from '@ds/Icones.jsx';
import { usePermissoes } from '@ds/permissoes.js';
import { useAgenda } from './hooks/useAgenda.js';
import { hoje } from './utils/datas.js';

const MESES_PADRAO = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DIAS_PADRAO = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function App() {
  const agenda = useAgenda();
  /* familiar cria e edita; cuidador só marca como concluído; idoso só vê */
  const { pode } = usePermissoes();
  const podeCriar = pode('agenda.criar');
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

  function avisar(msg, tipo) {
    setAviso({ msg, tipo, id: Date.now() });
  }

  async function gravar(acao, msgOk) {
    try {
      await acao();
      avisar(msgOk);
    } catch (e) {
      avisar('Não foi possível salvar: ' + e.message, 'erro');
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
      <Estado tipo="erro" titulo="Não foi possível carregar a agenda"
        acao={<button type="button" className="btn" onClick={() => window.location.reload()}>Tentar de novo</button>}>
        <p>{agenda.erro}. Confira a internet e tente de novo.</p>
      </Estado>
    );
  } else if (!agenda.carregando && !agenda.idosoId) {
    conteudo = (
      <Estado titulo="Nenhum idoso acompanhado">
        <p>Quando você acompanhar um idoso, a agenda dele aparece aqui.</p>
      </Estado>
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
          aoNovo={podeCriar ? () => setNovoAberto(true) : null}
        />
      </div>
    );
  }

  const idoso = agenda.idosos.find((i) => i.id === agenda.idosoId);
  const atalhos = [
    podeCriar && { rotulo: 'Novo compromisso', Icone: IconeMais, aoClicar: () => setNovoAberto(true) },
    { rotulo: 'Ver próximos compromissos', Icone: IconeAgenda, aoClicar: verProximos },
  ].filter(Boolean);

  return (
    <Shell tela="agenda" usuario={agenda.usuario} atalhos={atalhos}>
      <Cabecalho
        idoso={idoso}
        mes={agenda.mes}
        resumo={agenda.resumo}
        visao={agenda.visao}
        aoMudarVisao={agenda.mudarVisao}
        aoHoje={() => agenda.selecionar(hoje())}
        aoNovo={podeCriar ? () => setNovoAberto(true) : null}
      />
      {conteudo}
      {podeCriar && (
        <button type="button" className="fab" onClick={() => setNovoAberto(true)}>
          <IconeMais />
          Novo
        </button>
      )}
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
        podeEditar={pode('agenda.editar')}
        podeConcluir={pode('agenda.concluir')}
        aoMudarStatus={mudarStatus}
        aoExcluir={excluir}
      />
    </Shell>
  );
}
