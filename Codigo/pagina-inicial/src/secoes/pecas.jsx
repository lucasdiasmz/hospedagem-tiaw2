import { IconeTocar, SetaLonga } from '@ds/Icones.jsx';

/* peças repetidas da página */
export function Selo({ Icone, children }) {
  return <p className="selo">{Icone && <Icone tamanho={18} />}{children}</p>;
}

export function BotaoSeta({ href, className = 'btn-primario', children }) {
  return (
    <a className={'btn ' + className} href={href}>
      {children}
      <SetaLonga className="seta" />
    </a>
  );
}

/* botão redondo de tocar, com o texto ao lado */
export function BotaoTocar({ aoClicar, titulo, detalhe }) {
  return (
    <button type="button" className="tocar" onClick={aoClicar}>
      <span className="tocar-disco"><IconeTocar tamanho={18} /></span>
      <span className="tocar-texto">
        <strong>{titulo}</strong>
        {detalhe && <small>{detalhe}</small>}
      </span>
    </button>
  );
}

export function SeloFlutuante({ Icone, titulo, texto, className }) {
  return (
    <div className={'flutuante ' + className}>
      <span className="flutuante-icone"><Icone tamanho={22} /></span>
      <p><strong>{titulo}</strong><span>{texto}</span></p>
    </div>
  );
}
