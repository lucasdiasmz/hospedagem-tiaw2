import { useEffect, useRef } from 'react';

/* <dialog> nativo controlado pela prop "aberto"; fecha com Esc ou clique fora */
export default function Dialogo({ aberto, aoFechar, tituloId, className = '', children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dlg = ref.current;
    if (aberto && !dlg.open) dlg.showModal();
    if (!aberto && dlg.open) dlg.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      className={('dialogo ' + className).trim()}
      aria-labelledby={tituloId}
      onClose={aoFechar}
      onClick={(e) => { if (e.target === e.currentTarget) aoFechar(); }}
    >
      {children}
    </dialog>
  );
}
