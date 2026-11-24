import { useCallback, useEffect, useState } from "react";
import Icon from "../components/Icon.jsx";
import Toast from "../components/Toast.jsx";
import SeletorIdoso from "../components/SeletorIdoso.jsx";
import { EstadoCarregando, EstadoErro, EstadoVazio } from "../components/Estado.jsx";
import NavegadorData from "../components/linha-do-tempo/NavegadorData.jsx";
import ResumoDia from "../components/linha-do-tempo/ResumoDia.jsx";
import FiltroTipos from "../components/linha-do-tempo/FiltroTipos.jsx";
import FiltroMembro from "../components/linha-do-tempo/FiltroMembro.jsx";
import GrupoPeriodo from "../components/linha-do-tempo/GrupoPeriodo.jsx";
import ResumoSemana from "../components/linha-do-tempo/ResumoSemana.jsx";
import ModalPassagemPlantao from "../components/linha-do-tempo/ModalPassagemPlantao.jsx";
import { useIdosos } from "../hooks/useIdosos.js";
import { usePermissoes } from "@ds/permissoes.js";
import { listarRelatos, buscarResumoSemana, marcarComoVisto } from "../services/api.js";
import { hojeNoFuso } from "../utils/datas.js";
import { agruparPorPeriodo, getMembros, montarTextoPassagem } from "../utils/relatos.js";
import { getNomeCurto } from "../utils/formatadores.js";

function LinhaDoTempo() {
  const { idosos, idosoAtual, setIdosoAtualId, carregando, erro, recarregar } = useIdosos();
  /* idoso só consulta; familiar e cuidador marcam como visto e fazem a passagem de plantão */
  const { pode } = usePermissoes();
  const hoje = hojeNoFuso();

  const [data, setData] = useState(hoje);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroMembro, setFiltroMembro] = useState("todos");
  const [relatos, setRelatos] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [carregandoRelatos, setCarregandoRelatos] = useState(true);
  const [erroRelatos, setErroRelatos] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const [marcandoId, setMarcandoId] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [toast, setToast] = useState(null);

  let idosoId = null;
  if (idosoAtual) {
    idosoId = idosoAtual.id;
  }

  useEffect(function () {
    document.title = "AcessaMob | Linha do tempo";
  }, []);

  useEffect(function () {
    if (!idosoId) {
      return;
    }

    let ativo = true;
    setCarregandoRelatos(true);
    setErroRelatos("");

    Promise.all([listarRelatos(idosoId, data), buscarResumoSemana(idosoId, data)])
      .then(function (respostas) {
        if (ativo) {
          setRelatos(respostas[0].relatos);
          setResumo(respostas[1]);
        }
      })
      .catch(function (erroBusca) {
        if (ativo) {
          setRelatos([]);
          setResumo(null);
          setErroRelatos(erroBusca.message);
        }
      })
      .finally(function () {
        if (ativo) {
          setCarregandoRelatos(false);
        }
      });

    return function () {
      ativo = false;
    };
  }, [idosoId, data, tentativa]);

  const handleFecharModal = useCallback(function () {
    setModalAberto(false);
  }, []);

  const handleFecharToast = useCallback(function () {
    setToast(null);
  }, []);

  if (carregando) {
    return (
      <div className="pagina">
        <EstadoCarregando texto="Carregando linha do tempo..." />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="pagina">
        <EstadoErro titulo="Não foi possível carregar a linha do tempo" mensagem={erro} onTentarDeNovo={recarregar} />
      </div>
    );
  }

  if (!idosoAtual) {
    return (
      <div className="pagina">
        <EstadoVazio
          icone="users"
          titulo="Nenhum idoso cadastrado ainda"
          texto='Rode o comando "npm run seed" no back-end para inserir os dados de exemplo.'
        />
      </div>
    );
  }

  const membros = getMembros(relatos);

  let membroEfetivo = filtroMembro;
  const membroExiste = membros.some(function (membro) {
    return membro.nome === filtroMembro;
  });
  if (filtroMembro !== "todos" && !membroExiste) {
    membroEfetivo = "todos";
  }

  const relatosDoMembro = relatos.filter(function (relato) {
    if (membroEfetivo === "todos") {
      return true;
    } else {
      return relato.registradoPor.nome === membroEfetivo;
    }
  });

  const relatosFiltrados = relatosDoMembro.filter(function (relato) {
    if (filtroTipo === "todos") {
      return true;
    } else {
      return relato.tipo === filtroTipo;
    }
  });

  const grupos = agruparPorPeriodo(relatosFiltrados);
  const nomeIdoso = getNomeCurto(idosoAtual);

  function handleTrocarIdoso(id) {
    setIdosoAtualId(id);
    setFiltroMembro("todos");
  }

  function handleMudarData(novaData) {
    setData(novaData);
  }

  function handleLimparFiltros() {
    setFiltroTipo("todos");
    setFiltroMembro("todos");
  }

  async function handleMarcarVisto(relato) {
    setMarcandoId(relato.id);

    try {
      const atualizado = await marcarComoVisto(relato.id);
      setRelatos(function (anteriores) {
        return anteriores.map(function (item) {
          if (item.id === atualizado.id) {
            return atualizado;
          } else {
            return item;
          }
        });
      });
      setToast({ texto: "Relato marcado como visto", id: Date.now() });
    } catch (erroMarcar) {
      setToast({ texto: erroMarcar.message, id: Date.now() });
    } finally {
      setMarcandoId(null);
    }
  }

  function handleCopiado(copiou) {
    if (copiou) {
      setToast({ texto: "Texto copiado! É só colar para o próximo plantão.", id: Date.now() });
    } else {
      setToast({ texto: "Não deu para copiar automaticamente. Selecione o texto e copie.", id: Date.now() });
    }
  }

  let conteudo = null;
  if (carregandoRelatos) {
    conteudo = <EstadoCarregando texto="Buscando relatos..." />;
  } else if (erroRelatos) {
    conteudo = (
      <EstadoErro
        titulo="Não foi possível carregar os relatos"
        mensagem={erroRelatos}
        onTentarDeNovo={function () {
          setTentativa(tentativa + 1);
        }}
      />
    );
  } else if (relatos.length === 0) {
    conteudo = (
      <EstadoVazio
        icone="message"
        titulo="Nenhum relato registrado neste dia"
        texto="Quando alguém da rede de apoio registrar algo, aparece aqui."
      />
    );
  } else if (relatosFiltrados.length === 0) {
    conteudo = (
      <div className="estado">
        <Icon name="message" />
        <strong>Nenhum relato com esses filtros</strong>
        <button type="button" className="btn" onClick={handleLimparFiltros}>
          Limpar filtros
        </button>
      </div>
    );
  } else {
    conteudo = grupos.map(function (grupo) {
      return (
        <GrupoPeriodo
          key={grupo.periodo.id}
          grupo={grupo}
          marcandoId={marcandoId}
          onMarcarVisto={pode("linha.marcarVisto") ? handleMarcarVisto : null}
        />
      );
    });
  }

  let modal = null;
  if (modalAberto) {
    modal = (
      <ModalPassagemPlantao
        texto={montarTextoPassagem({ idoso: idosoAtual, data: data, hoje: hoje, relatos: relatos, resumo: resumo })}
        onFechar={handleFecharModal}
        onCopiado={handleCopiado}
      />
    );
  }

  return (
    <div className="pagina">
      <div className="page-head">
        <div>
          <nav className="breadcrumb" aria-label="Você está em">
            <span>Diário de cuidado</span>
            <Icon name="chevron-right" />
            <span>{idosoAtual.nome}</span>
          </nav>
          <h1>Linha do tempo</h1>
          <p className="subtitle">O que a rede de apoio registrou sobre {nomeIdoso} ao longo do dia.</p>
        </div>
        <SeletorIdoso idosos={idosos} idosoAtualId={idosoAtual.id} onTrocar={handleTrocarIdoso} />
      </div>

      <NavegadorData data={data} hoje={hoje} onMudarData={handleMudarData} />

      <div className="ldt-layout">
        <div className="ldt-stats">
          <ResumoDia relatos={relatos} carregando={carregandoRelatos} />
        </div>

        <section className="card ldt-main" aria-label="Relatos do dia">
          <div className="ldt-filtros">
            <FiltroTipos relatos={relatosDoMembro} filtroAtual={filtroTipo} onFiltrar={setFiltroTipo} />
            <FiltroMembro membros={membros} filtroAtual={membroEfetivo} onFiltrar={setFiltroMembro} />
          </div>
          {conteudo}
        </section>

        <aside className="ldt-side">
          <ResumoSemana resumo={resumo} carregando={carregandoRelatos} />
          {pode("linha.plantao") && <button
            type="button"
            className="btn btn-primario btn-bloco"
            disabled={carregandoRelatos || erroRelatos !== ""}
            onClick={function () {
              setModalAberto(true);
            }}
          >
            <Icon name="clipboard" />
            Passagem de plantão
          </button>}
        </aside>
      </div>

      {modal}
      <Toast toast={toast} onFechar={handleFecharToast} />
    </div>
  );
}

export default LinhaDoTempo;
