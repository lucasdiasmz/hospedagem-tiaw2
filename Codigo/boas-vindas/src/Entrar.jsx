import { useState } from 'react';
import { TELAS } from '@ds/navegacao.js';
import { entrar } from '@ds/sessao.js';
import { Campo, CampoSenha, focarErro } from './componentes.jsx';
import { emailValido } from './validacao.js';

/* login; tituloRef recebe o foco quando a tela abre */
export default function Entrar({ tituloRef, salvo, sessaoAcabou, aoCriar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    const formulario = e.currentTarget;
    const novos = {};
    if (!emailValido(email)) novos.email = 'Confira o e-mail.';
    if (!senha) novos.senha = 'Digite a senha.';
    setErros(novos);
    if (Object.keys(novos).length) {
      focarErro(formulario);
      return;
    }
    setEnviando(true);
    try {
      await entrar(email, senha);
      window.location.assign(TELAS.inicio);
    } catch (falha) {
      setErros({ geral: falha.message });
      setEnviando(false);
    }
  }

  return (
    <section aria-labelledby="titulo-passo">
      <h1 id="titulo-passo" ref={tituloRef} tabIndex={-1}>Boas-vindas!</h1>
      <p className="bv-sub">
        {sessaoAcabou ? 'Sua sessão terminou. Entre de novo para continuar.' : 'Entre com o seu e-mail e a sua senha.'}
      </p>
      <form className="formulario" onSubmit={enviar} noValidate>
        <Campo rotulo="E-mail" type="email" inputMode="email" autoComplete="email" autoCapitalize="none"
          value={email} onChange={(e) => setEmail(e.target.value)} erro={erros.email} />
        <CampoSenha autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} erro={erros.senha} />
        {erros.geral && <p className="erro-form" role="alert">{erros.geral}</p>}
        <button type="submit" className="btn btn-primario btn-bloco" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
      </form>

      <div className="bv-outro">
        <p>Ainda não tem conta?</p>
        <button type="button" className="btn btn-bloco" onClick={aoCriar}>Criar conta</button>
        {salvo.perfil && (
          <a className="btn btn-texto" href={TELAS.inicio}>Continuar como {salvo.nome ? salvo.nome.split(' ')[0] : 'antes'}</a>
        )}
      </div>
    </section>
  );
}
