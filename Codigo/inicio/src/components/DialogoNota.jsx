import { useEffect, useRef, useState } from 'react';
import Dialogo from '@ds/Dialogo.jsx';
import { horaAgora } from '../utils/hora.js';

const SUGESTOES = ['Pressão medida', 'Comeu bem', 'Dormiu mal', 'Sentiu dor', 'Tomou banho'];

/* janela para adicionar anotação na linha do dia */
export default function DialogoNota({ aberto, aoFechar, aoSalvar }) {
  const [hora, setHora] = useState('');
  const [texto, setTexto] = useState('');
  const textoRef = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    setHora(horaAgora());
    setTexto('');
    /* o conteúdo do diálogo só existe aberto; espera ele montar para focar */
    requestAnimationFrame(() => textoRef.current?.focus());
  }, [aberto]);

  function enviar(e) {
    e.preventDefault();
    const limpo = texto.trim();
    if (!limpo || !hora) return;
    aoSalvar({ id: Date.now(), hora, texto: limpo });
  }

  return (
    <Dialogo aberto={aberto} aoFechar={aoFechar} titulo="Nova anotação" descricao="Fica registrada no dia de hoje para toda a rede de apoio.">
      <form onSubmit={enviar}>
        <label className="campo">
          O que aconteceu?
          <textarea
            ref={textoRef}
            rows="3"
            maxLength="120"
            placeholder="Ex.: Pressão medida, 12 por 8"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            required
          ></textarea>
          <small>{texto.length}/120 caracteres</small>
        </label>

        <div className="pilulas" role="group" aria-label="Sugestões">
          {SUGESTOES.map((s) => (
            <button key={s} type="button" className="pilula" onClick={() => setTexto((t) => (t ? t + '. ' + s : s).slice(0, 120))}>
              {s}
            </button>
          ))}
        </div>

        <label className="campo">
          Horário
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
        </label>

        <div className="dialogo-botoes">
          <button type="button" className="btn" onClick={aoFechar}>Cancelar</button>
          <button type="submit" className="btn btn-primario">Salvar anotação</button>
        </div>
      </form>
    </Dialogo>
  );
}
