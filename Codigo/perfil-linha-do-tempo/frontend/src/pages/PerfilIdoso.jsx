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

function PerfilIdoso() {
  const { idosos, setIdosos, idosoAtual, setIdosoAtualId, carregando, erro, recarregar } = useIdosos();
  const [modalAberto, setModalAberto] = useState(false);
  const [toast, setToast] = useState(null);

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
      <main className="content">
        <EstadoCarregando texto="Carregando perfil..." />
      </main>
    );
  }

  if (erro) {
    return (
      <main className="content">
        <EstadoErro titulo="Não foi possível carregar os perfis" mensagem={erro} onTentarDeNovo={recarregar} />
      </main>
    );
  }

  if (!idosoAtual) {
    return (
      <main className="content">
        <EstadoVazio
          icone="users"
          titulo="Nenhum idoso cadastrado ainda"
          texto='Rode o comando "npm run seed" no back-end para inserir os dados de exemplo.'
        />
      </main>
    );
  }

  function handleTrocarIdoso(id) {
    setIdosoAtualId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <main className="content">
      <PerfilHeader idosos={idosos} idosoAtual={idosoAtual} onTrocarIdoso={handleTrocarIdoso} />
      <HeroIdoso
        idoso={idosoAtual}
        onEditar={function () {
          setModalAberto(true);
        }}
      />
      <ResumoStats idoso={idosoAtual} />
      <AlertaAlergias alergias={idosoAtual.alergias} />

      <div className="grid">
        <CardSobre idoso={idosoAtual} />
        <CardInfoPessoal idoso={idosoAtual} />
        <CardMobilidade mobilidade={idosoAtual.mobilidade} />
        <CardSaude condicoes={idosoAtual.condicoes} />
        <CardMedicamentos medicamentos={idosoAtual.medicamentos} />
        <CardRotina rotina={idosoAtual.rotina} />
        <CardContatos contatos={idosoAtual.contatos} />
        <CardEquipe cuidadores={idosoAtual.cuidadores} />
      </div>

      {modal}
      <Toast toast={toast} onFechar={handleFecharToast} />
    </main>
  );
}

export default PerfilIdoso;
