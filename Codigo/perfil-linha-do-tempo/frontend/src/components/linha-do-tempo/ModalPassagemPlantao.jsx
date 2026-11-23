import { useEffect, useRef } from "react";
import Dialogo from "@ds/Dialogo.jsx";
import Icon from "../Icon.jsx";

function ModalPassagemPlantao({ texto, onFechar, onCopiado }) {
  const textoRef = useRef(null);
  const botaoCopiarRef = useRef(null);

  useEffect(function () {
    requestAnimationFrame(function () {
      if (botaoCopiarRef.current) {
        botaoCopiarRef.current.focus();
      }
    });
  }, []);

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

  return (
    <Dialogo aberto aoFechar={onFechar} titulo="Passagem de plantão">
        <p className="modal-desc">
          Resumo pronto para enviar a quem assume o próximo turno. Copie e cole no WhatsApp ou no caderno de plantão.
        </p>
        <label className="somente-leitor" htmlFor="textoPassagem">Texto da passagem de plantão</label>
        <textarea id="textoPassagem" ref={textoRef} className="texto-passagem" value={texto} readOnly rows={14} />
        <div className="form-actions">
          <button type="button" className="btn" onClick={onFechar}>
            Fechar
          </button>
          <button type="button" className="btn btn-primario" ref={botaoCopiarRef} onClick={handleCopiar}>
            <Icon name="copy" />
            Copiar texto
          </button>
        </div>
      </Dialogo>
  );
}

export default ModalPassagemPlantao;
