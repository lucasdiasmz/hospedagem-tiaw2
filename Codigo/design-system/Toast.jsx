import { useEffect, useState } from 'react';
import { IconeAlerta, IconeCheck } from './Icones.jsx';

/* Aviso rápido de confirmação. "aviso" = { msg, id, tipo?, acao? }; um id novo mostra de novo.
   tipo 'erro' fica mais tempo na tela e usa a cor de erro.
   acao = { rotulo, aoClicar } mostra um botão (ex.: Desfazer) e dá mais tempo para tocar nele. */
export default function Toast({ aviso }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!aviso) return;
    setVisivel(true);
    const timer = setTimeout(() => setVisivel(false), aviso.acao ? 10000 : aviso.tipo === 'erro' ? 6000 : 3200);
    return () => clearTimeout(timer);
  }, [aviso]);

  const erro = aviso?.tipo === 'erro' || /^não foi possível/i.test(aviso?.msg || '');

  return (
    <div className={'toast' + (visivel ? ' visivel' : '') + (erro ? ' toast--erro' : '')} role="status" aria-live="polite">
      {aviso && (erro ? <IconeAlerta /> : <IconeCheck />)}
      <span>{aviso ? aviso.msg : ''}</span>
      {visivel && aviso?.acao && (
        <button type="button" className="toast-acao" onClick={() => { setVisivel(false); aviso.acao.aoClicar(); }}>
          {aviso.acao.rotulo}
        </button>
      )}
    </div>
  );
}
