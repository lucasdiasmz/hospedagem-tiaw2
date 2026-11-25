import { SetaLonga } from '@ds/Icones.jsx';
import { RECURSOS } from '../conteudo.js';

export default function Recursos({ aoAbrir }) {
  return (
    <section id="recursos" className="recursos" aria-labelledby="titulo-recursos">
      <div className="largura">
        <h2 id="titulo-recursos" className="somente-leitor">Recursos</h2>
        <ul className="recursos-grade">
          {RECURSOS.map(({ id, titulo, texto, imagem }) => (
            <li key={id} className={'recurso recurso--' + id}>
              <img src={imagem} alt="" width="560" height="560" loading="lazy" />
              <h3>
                {/* o botão cobre o cartão inteiro */}
                <button type="button" onClick={() => aoAbrir(id)}>{titulo}<span className="somente-leitor">: ver a tela</span></button>
              </h3>
              <p>{texto}</p>
              <span className="recurso-seta" aria-hidden="true"><SetaLonga className="seta" tamanho={20} /></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
