import { useEffect, useRef, useState } from 'react';
import { horaAgora } from '../utils/hora.js';
import Dialogo from './Dialogo.jsx';

/* janela para adicionar anotação na linha do tempo */
export default function DialogoNota({ aberto, aoFechar, aoSalvar }) {
  const [hora, setHora] = useState('');
  const [texto, setTexto] = useState('');
  const textoRef = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    setHora(horaAgora());
    setTexto('');
    textoRef.current.focus();
  }, [aberto]);

  function enviar(e) {
    e.preventDefault();
    const limpo = texto.trim();
    if (!limpo || !hora) return;
    aoSalvar({ id: Date.now(), hora, texto: limpo });
  }

  return (
    <Dialogo aberto={aberto} aoFechar={aoFechar} tituloId="dlg-titulo">
      <form onSubmit={enviar}>
        <h2 id="dlg-titulo">Nova anotação</h2>

        <label className="campo">
          Horário
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
        </label>

        <label className="campo">
          Anotação
          <textarea
            ref={textoRef}
            rows="3"
            maxLength="120"
            placeholder="Ex.: Pressão medida, 12 por 8"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            required
          ></textarea>
        </label>

        <div className="dialogo-botoes">
          <button type="button" className="btn" onClick={aoFechar}>Cancelar</button>
          <button type="submit" className="btn btn-primario">Salvar</button>
        </div>
      </form>
    </Dialogo>
  );
}
