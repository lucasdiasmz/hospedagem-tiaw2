import { useEffect, useRef, useState } from "react";
import Icon from "../Icon.jsx";

const tiposSanguineos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const niveisMobilidade = ["Independente", "Parcial", "Dependente"];

function criarFormInicial(idoso) {
  return {
    nome: idoso.nome,
    apelido: idoso.apelido || "",
    dataNascimento: idoso.dataNascimento,
    telefone: idoso.telefone || "",
    tipoSanguineo: idoso.tipoSanguineo,
    planoSaude: idoso.planoSaude || "",
    nivel: idoso.mobilidade.nivel,
    endereco: idoso.endereco || "",
    descricaoMobilidade: idoso.mobilidade.descricao || "",
    sobre: idoso.sobre || "",
    observacoes: idoso.observacoes || ""
  };
}

function ModalEditarPerfil({ idoso, onSalvar, onFechar }) {
  const [form, setForm] = useState(function () {
    return criarFormInicial(idoso);
  });
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const nomeRef = useRef(null);

  useEffect(function () {
    nomeRef.current.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(evento) {
      if (evento.key === "Escape") {
        onFechar();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function () {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onFechar]);

  function handleChange(evento) {
    const campo = evento.target.name;
    const valor = evento.target.value;
    setForm(function (anterior) {
      return { ...anterior, [campo]: valor };
    });
  }

  async function handleSubmit(evento) {
    evento.preventDefault();

    if (salvando) {
      return;
    }

    const nome = form.nome.trim();
    const hoje = new Date();

    if (nome === "") {
      setErro("Informe o nome do idoso.");
    } else if (form.dataNascimento === "") {
      setErro("Informe a data de nascimento.");
    } else if (new Date(form.dataNascimento + "T00:00:00") > hoje) {
      setErro("A data de nascimento não pode ser no futuro.");
    } else {
      setErro("");
      setSalvando(true);
      try {
        await enviar(nome);
      } catch (erroServidor) {
        setErro(erroServidor.message);
        setSalvando(false);
      }
    }
  }

  function enviar(nome) {
    return onSalvar({
      ...form,
      nome: nome,
      apelido: form.apelido.trim(),
      telefone: form.telefone.trim(),
      planoSaude: form.planoSaude.trim(),
      endereco: form.endereco.trim(),
      descricaoMobilidade: form.descricaoMobilidade.trim(),
      sobre: form.sobre.trim(),
      observacoes: form.observacoes.trim()
    });
  }

  function handleClickFundo(evento) {
    if (evento.target === evento.currentTarget) {
      onFechar();
    }
  }

  let textoBotao = "Salvar";
  if (salvando) {
    textoBotao = "Salvando...";
  }

  let mensagemErro = null;
  if (erro) {
    mensagemErro = (
      <p className="form-erro" role="alert">
        {erro}
      </p>
    );
  }

  return (
    <div className="modal" onClick={handleClickFundo}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="tituloModal">
        <div className="modal-head">
          <h2 id="tituloModal">Editar perfil</h2>
          <button type="button" className="icon-btn" aria-label="Fechar" onClick={onFechar}>
            <Icon name="x" />
          </button>
        </div>

        <form className="form" noValidate onSubmit={handleSubmit}>
          <div className="field field-full">
            <label htmlFor="campoNome">Nome completo *</label>
            <input ref={nomeRef} id="campoNome" name="nome" type="text" autoComplete="off" value={form.nome} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="campoApelido">Como prefere ser chamado(a)</label>
            <input id="campoApelido" name="apelido" type="text" autoComplete="off" value={form.apelido} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="campoNascimento">Data de nascimento *</label>
            <input id="campoNascimento" name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="campoTelefone">Telefone</label>
            <input id="campoTelefone" name="telefone" type="tel" placeholder="(31) 99999-9999" value={form.telefone} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="campoSangue">Tipo sanguíneo</label>
            <select id="campoSangue" name="tipoSanguineo" value={form.tipoSanguineo} onChange={handleChange}>
              {tiposSanguineos.map(function (tipo) {
                return <option key={tipo}>{tipo}</option>;
              })}
            </select>
          </div>
          <div className="field">
            <label htmlFor="campoPlano">Plano de saúde</label>
            <input id="campoPlano" name="planoSaude" type="text" value={form.planoSaude} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="campoNivel">Nível de mobilidade</label>
            <select id="campoNivel" name="nivel" value={form.nivel} onChange={handleChange}>
              {niveisMobilidade.map(function (nivel) {
                return <option key={nivel}>{nivel}</option>;
              })}
            </select>
          </div>
          <div className="field field-full">
            <label htmlFor="campoEndereco">Endereço</label>
            <input id="campoEndereco" name="endereco" type="text" value={form.endereco} onChange={handleChange} />
          </div>
          <div className="field field-full">
            <label htmlFor="campoDescricaoMob">Como é a mobilidade no dia a dia</label>
            <textarea id="campoDescricaoMob" name="descricaoMobilidade" value={form.descricaoMobilidade} onChange={handleChange} />
          </div>
          <div className="field field-full">
            <label htmlFor="campoSobre">Sobre</label>
            <textarea id="campoSobre" name="sobre" value={form.sobre} onChange={handleChange} />
          </div>
          <div className="field field-full">
            <label htmlFor="campoObs">Observações para a equipe</label>
            <textarea id="campoObs" name="observacoes" value={form.observacoes} onChange={handleChange} />
          </div>

          {mensagemErro}

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onFechar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              <Icon name="check" />
              {textoBotao}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEditarPerfil;
