import { useId, useState } from 'react';

/* rótulo, campo e erro ligados; o resto das propriedades vai para o <input> */
export function Campo({ rotulo, opcional, erro, dica, children, ...input }) {
  const id = useId();
  const descrito = [erro && id + '-erro', dica && id + '-dica'].filter(Boolean).join(' ') || undefined;
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo} {opcional && <small>(opcional)</small>}</label>
      {children
        ? children({ id, 'aria-invalid': erro ? 'true' : undefined, 'aria-describedby': descrito })
        : <input id={id} aria-invalid={erro ? 'true' : undefined} aria-describedby={descrito} {...input} />}
      {dica && <small id={id + '-dica'} className="bv-dica">{dica}</small>}
      {erro && <span className="campo-erro" id={id + '-erro'}>{erro}</span>}
    </div>
  );
}

export function CampoSenha({ rotulo = 'Senha', ...props }) {
  const [visivel, setVisivel] = useState(false);
  const { value, onChange, autoComplete, ...resto } = props;
  return (
    <Campo rotulo={rotulo} {...resto}>
      {(ligacao) => (
        <span className="bv-senha">
          <input {...ligacao} type={visivel ? 'text' : 'password'} value={value} onChange={onChange}
            autoComplete={autoComplete} autoCapitalize="none" spellCheck="false" />
          <button type="button" className="btn btn-texto" aria-pressed={visivel} onClick={() => setVisivel(!visivel)}>
            {visivel ? 'Esconder' : 'Mostrar'}
          </button>
        </span>
      )}
    </Campo>
  );
}

/* opções em pílulas; tipo 'radio' ou 'checkbox' */
export function Opcoes({ legenda, tipo, nome, opcoes, marcada, aoMudar, erro }) {
  const id = useId();
  return (
    <fieldset className="campo bv-fieldset bv-tudo" aria-describedby={erro ? id : undefined}>
      <legend>{legenda}</legend>
      <div className="pilulas">
        {opcoes.map((o, i) => (
          <label key={o.id} className="pilula">
            <input type={tipo} name={nome} data-erro={erro && i === 0 ? 'true' : undefined} checked={marcada(o.id)} onChange={() => aoMudar(o.id)} />
            {o.rotulo}
          </label>
        ))}
      </div>
      {erro && <span className="campo-erro" id={id}>{erro}</span>}
    </fieldset>
  );
}

export function Passos({ atual }) {
  return (
    <ol className="passos" aria-label={'Passo ' + atual + ' de 3'}>
      {[1, 2, 3].map((n) => (
        <li key={n} className={n < atual ? 'feito' : n === atual ? 'atual' : ''} aria-current={n === atual ? 'step' : undefined}>
          <span className="somente-leitor">Passo {n}</span>
        </li>
      ))}
    </ol>
  );
}

/* leva o foco ao primeiro campo com erro, depois que a tela mostra as mensagens */
export function focarErro(formulario) {
  requestAnimationFrame(() => formulario.querySelector('[aria-invalid="true"], [data-erro="true"]')?.focus());
}
