import { useEffect, useRef } from 'react';
import { IconeFechar } from './Icones.jsx';

/* <dialog> nativo controlado pela prop "aberto"; fecha com Esc, com o X ou tocando fora.
   No celular abre como folha que sobe da parte de baixo; no computador, centralizado.
   "titulo" vira o <h2> do cabeçalho; sem ele, o conteúdo traz o próprio título (tituloId). */
export default function Dialogo({ aberto, aoFechar, titulo, tituloId, descricao, largo = false, className = '', children }) {
  const ref = useRef(null);
  const idTitulo = tituloId || (titulo ? 'dlg-' + titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (aberto && !dlg.open) dlg.showModal();
    if (!aberto && dlg.open) dlg.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      className={'dialogo' + (largo ? ' dialogo--largo' : '') + (className ? ' ' + className : '')}
      aria-labelledby={idTitulo}
      onClose={aoFechar}
      onCancel={(e) => { e.preventDefault(); aoFechar(); }}
      onClick={(e) => { if (e.target === e.currentTarget) aoFechar(); }}
    >
      <div className="dialogo-corpo">
        {titulo && (
          <header className="dialogo-topo">
            <div>
              <h2 id={idTitulo}>{titulo}</h2>
              {descricao && <p>{descricao}</p>}
            </div>
            <button type="button" className="btn-icone" aria-label="Fechar" onClick={aoFechar}>
              <IconeFechar />
            </button>
          </header>
        )}
        {aberto && children}
      </div>
    </dialog>
  );
}
