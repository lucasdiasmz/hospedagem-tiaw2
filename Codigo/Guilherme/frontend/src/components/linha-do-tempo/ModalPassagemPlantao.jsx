import { useEffect, useRef } from "react";
import Icon from "../Icon.jsx";

function ModalPassagemPlantao({ texto, onFechar, onCopiado }) {
  const textoRef = useRef(null);
  const botaoCopiarRef = useRef(null);

  useEffect(function () {
    botaoCopiarRef.current.focus();
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

  async function handleCopiar() {
    try {
      await navigator.clipboard.writeText(texto);
      onCopiado(true);
    } catch (erro) {
      textoRef.current.select();
      let copiou = false;
      try {
        copiou = document.execCommand("copy");
      } catch (erroCopia) {
        copiou = false;
      }
      onCopiado(copiou);
    }
  }

  function handleClickFundo(evento) {
    if (evento.target === evento.currentTarget) {
      onFechar();
    }
  }

  return (
    <div className="modal" onClick={handleClickFundo}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="tituloPassagem">
        <div className="modal-head">
          <h2 id="tituloPassagem">Passagem de plantão</h2>
          <button type="button" className="icon-btn" aria-label="Fechar" onClick={onFechar}>
            <Icon name="x" />
          </button>
        </div>
        <p className="modal-desc">
          Resumo pronto para enviar a quem assume o próximo turno. Copie e cole no WhatsApp ou no caderno de plantão.
        </p>
        <label className="sr-only" htmlFor="textoPassagem">Texto da passagem de plantão</label>
        <textarea id="textoPassagem" ref={textoRef} className="texto-passagem" value={texto} readOnly rows={14} />
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onFechar}>
            Fechar
          </button>
          <button type="button" className="btn btn-primary" ref={botaoCopiarRef} onClick={handleCopiar}>
            <Icon name="copy" />
            Copiar texto
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalPassagemPlantao;
