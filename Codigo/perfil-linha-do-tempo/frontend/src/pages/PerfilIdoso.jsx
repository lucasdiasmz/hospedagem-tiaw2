import { useCallback, useEffect, useState } from "react";
import PerfilHeader from "../components/perfil/PerfilHeader.jsx";
import HeroIdoso from "../components/perfil/HeroIdoso.jsx";
import ResumoStats from "../components/perfil/ResumoStats.jsx";
import AlertaAlergias from "../components/perfil/AlertaAlergias.jsx";
import CardSobre from "../components/perfil/CardSobre.jsx";
import CardInfoPessoal from "../components/perfil/CardInfoPessoal.jsx";
import CardMobilidade from "../components/perfil/CardMobilidade.jsx";
import CardSaude from "../components/perfil/CardSaude.jsx";
import CardMedicamentos from "../components/perfil/CardMedicamentos.jsx";
import CardRotina from "../components/perfil/CardRotina.jsx";
import CardContatos from "../components/perfil/CardContatos.jsx";
import CardEquipe from "../components/perfil/CardEquipe.jsx";
import ModalEditarPerfil from "../components/perfil/ModalEditarPerfil.jsx";
import Toast from "../components/Toast.jsx";
import { EstadoCarregando, EstadoErro, EstadoVazio } from "../components/Estado.jsx";
import { useIdosos } from "../hooks/useIdosos.js";
import { atualizarIdoso } from "../services/api.js";
import { usePermissoes } from "@ds/permissoes.js";

/* uma seção por vez, em vez de oito cartões empilhados numa página comprida */
const SECOES = [
  { id: "saude", rotulo: "Saúde" },
  { id: "rotina", rotulo: "Rotina" },
  { id: "rede", rotulo: "Contatos" },
  { id: "dados", rotulo: "Dados" }
];

function PerfilIdoso() {
  const { idosos, setIdosos, idosoAtual, setIdosoAtualId, carregando, erro, recarregar } = useIdosos();
  const [modalAberto, setModalAberto] = useState(false);
  /* só o familiar responsável edita o perfil; idoso e cuidador consultam */
  const { pode } = usePermissoes();
  const [toast, setToast] = useState(null);
  const [secao, setSecao] = useState("saude");

  useEffect(function () {
    document.title = "AcessaMob | Perfil do idoso";
  }, []);

  const handleFecharModal = useCallback(function () {
    setModalAberto(false);
  }, []);

  const handleFecharToast = useCallback(function () {
    setToast(null);
  }, []);

  if (carregando) {
    return (
      <div className="pagina">
        <EstadoCarregando texto="Carregando perfil..." />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="pagina">
        <EstadoErro titulo="Não foi possível carregar os perfis" mensagem={erro} onTentarDeNovo={recarregar} />
      </div>
    );
  }

  if (!idosoAtual) {
    return (
      <div className="pagina">
        <EstadoVazio
          icone="users"
          titulo="Nenhuma pessoa vinculada ainda"
          texto="Cadastre a pessoa ou use um código de convite no Início."
        />
      </div>
    );
  }

  function handleTrocarIdoso(id) {
    setIdosoAtualId(id);
  }

  async function handleSalvar(dados) {
    const atualizado = {
      ...idosoAtual,
      nome: dados.nome,
      apelido: dados.apelido,
      dataNascimento: dados.dataNascimento,
      telefone: dados.telefone,
      tipoSanguineo: dados.tipoSanguineo,
      planoSaude: dados.planoSaude,
      endereco: dados.endereco,
      sobre: dados.sobre,
      observacoes: dados.observacoes,
      mobilidade: {
        ...idosoAtual.mobilidade,
        nivel: dados.nivel,
        descricao: dados.descricaoMobilidade
      }
    };

    const salvo = await atualizarIdoso(idosoAtual.id, atualizado);

    setIdosos(function (anteriores) {
      return anteriores.map(function (idoso) {
        if (idoso.id === salvo.id) {
          return salvo;
        } else {
          return idoso;
        }
      });
    });

    setModalAberto(false);
    setToast({ texto: "Perfil atualizado com sucesso!", id: Date.now() });
  }

  let modal = null;
  if (modalAberto) {
    modal = (
      <ModalEditarPerfil
        idoso={idosoAtual}
        onSalvar={handleSalvar}
        onFechar={handleFecharModal}
      />
    );
  }

  return (
    <div className="pagina">
      <PerfilHeader idosos={idosos} idosoAtual={idosoAtual} onTrocarIdoso={handleTrocarIdoso} />

      <div className="perfil-layout">
        <div className="perfil-fixo rolavel">
          <HeroIdoso
            idoso={idosoAtual}
            onEditar={pode("perfil.editar") ? function () {
              setModalAberto(true);
            } : null}
          />
          <AlertaAlergias alergias={idosoAtual.alergias} />
          <ResumoStats idoso={idosoAtual} />
        </div>

        <div className="perfil-detalhes">
          <div className="segmentado" role="tablist" aria-label="Seções do perfil">
            {SECOES.map(function (item) {
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={"aba-" + item.id}
                  aria-selected={secao === item.id}
                  aria-controls="secao-perfil"
                  onClick={function () {
                    setSecao(item.id);
                  }}
                >
                  {item.rotulo}
                </button>
              );
            })}
          </div>

          <div className="grid rolavel" key={secao} id="secao-perfil" role="tabpanel" aria-labelledby={"aba-" + secao}>
            {secao === "saude" && (
              <>
                <CardMedicamentos medicamentos={idosoAtual.medicamentos} />
                <CardSaude condicoes={idosoAtual.condicoes} />
                <CardMobilidade mobilidade={idosoAtual.mobilidade} />
              </>
            )}
            {secao === "rotina" && (
              <>
                <CardRotina rotina={idosoAtual.rotina} />
                <CardSobre idoso={idosoAtual} />
              </>
            )}
            {secao === "rede" && (
              <>
                <CardContatos contatos={idosoAtual.contatos} />
                <CardEquipe cuidadores={idosoAtual.cuidadores} />
              </>
            )}
            {secao === "dados" && <CardInfoPessoal idoso={idosoAtual} />}
          </div>
        </div>
      </div>

      {modal}
      <Toast toast={toast} onFechar={handleFecharToast} />
    </div>
  );
}

export default PerfilIdoso;
