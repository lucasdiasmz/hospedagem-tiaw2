import { useEffect, useRef, useState } from 'react';
import { IconeCheck, IconeCuidadores, IconeEscudo, IconePerfis, IconeVoltar, SetaDireita } from '@ds/Icones.jsx';
import { TELAS } from '@ds/navegacao.js';
import Acessibilidade from '@ds/Acessibilidade.jsx';
import { lerPreferencias } from '@ds/preferencias.js';
import { cadastrar } from '@ds/sessao.js';
import logo from '@ds/assets/logo-acessamob.png';
import { Campo, CampoSenha, Passos, focarErro } from './componentes.jsx';
import Entrar from './Entrar.jsx';
import Passo3 from './Passo3.jsx';
import { errosDoPasso3, errosDosDados, mascararTelefone, montarCadastro } from './validacao.js';

/* Entrada do AcessaMob: login ou cadastro em 3 passos (perfil → seus dados → vínculo ou experiência).
   A conta fica no servidor; neste aparelho ficam só o nome, o perfil e a acessibilidade. */

const PERFIS = [
  { id: 'idoso', titulo: 'Sou idoso(a)', descricao: 'Quero mais autonomia e segurança no dia a dia', Icone: IconePerfis },
  { id: 'cliente', titulo: 'Sou familiar ou responsável', descricao: 'Quero acompanhar e cuidar de quem eu amo', Icone: IconeCuidadores },
  { id: 'cuidador', titulo: 'Sou cuidador(a) profissional', descricao: 'Quero oferecer meus serviços e encontrar famílias', Icone: IconeEscudo },
];

const PASSO3 = {
  ligacao: 'novo', codigo: '', nomeIdoso: '', nascimento: '', mobilidade: 'nenhuma',
  experiencia: '', servicos: [], dias: [], inicio: '08:00', fim: '18:00', consentimento: false,
};

export default function App() {
  const [salvo] = useState(lerPreferencias);
  const [sessaoAcabou] = useState(() => new URLSearchParams(window.location.search).get('sessao') === 'fim');
  const [criando, setCriando] = useState(false);
  const [passo, setPasso] = useState(1);
  const [perfil, setPerfil] = useState(null);
  const [dados, setDados] = useState({ nome: '', telefone: '', email: '', senha: '' });
  const [p, setP] = useState(PASSO3);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const tituloRef = useRef(null);

  /* a cada passo o foco vai para o título, para leitores de tela anunciarem a mudança */
  useEffect(() => {
    tituloRef.current?.focus();
    window.scrollTo({ top: 0 });
    tituloRef.current?.closest('main')?.scrollTo({ top: 0 });
  }, [criando, passo]);

  function irPara(n) {
    setErros({});
    setPasso(n);
  }

  function escolherPerfil(id) {
    setPerfil(id);
    setP({ ...PASSO3, consentimento: false });
    irPara(2);
  }

  function mudarDado(campo, valor) {
    setDados((d) => ({ ...d, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  }

  function mudar(campo, valor, erro = campo) {
    setP((x) => ({ ...x, [campo]: valor }));
    setErros((e) => ({ ...e, [erro]: undefined, geral: undefined }));
  }

  function enviarDados(e) {
    e.preventDefault();
    const novos = errosDosDados(dados);
    setErros(novos);
    if (Object.keys(novos).length) focarErro(e.currentTarget);
    else irPara(3);
  }

  async function concluir(e) {
    e.preventDefault();
    const formulario = e.currentTarget;
    const novos = errosDoPasso3(perfil, p);
    setErros(novos);
    if (Object.keys(novos).length) {
      focarErro(formulario);
      return;
    }
    setEnviando(true);
    try {
      await cadastrar(montarCadastro(perfil, dados, p));
      window.location.assign(TELAS.inicio);
    } catch (falha) {
      setErros({ geral: falha.message });
      setEnviando(false);
    }
  }

  return (
    <div className="boas-vindas">
      <header className="bv-marca">
        <img src={logo} alt="" width="56" height="56" />
        <div>
          <span className="bv-nome">AcessaMob</span>
          <span className="bv-slogan">Mais cuidado, todos os dias.</span>
        </div>
        {/* antes a letra maior só aparecia no fim do cadastro */}
        <div className="bv-acess acess--escuro"><Acessibilidade compacta /></div>
      </header>

      <main className="bv-conteudo">
        {!criando && (
          <Entrar tituloRef={tituloRef} salvo={sessaoAcabou ? {} : salvo} sessaoAcabou={sessaoAcabou} aoCriar={() => setCriando(true)} />
        )}

        {criando && <Passos atual={passo} />}

        {criando && passo === 1 && (
          <section aria-labelledby="titulo-passo">
            <button type="button" className="voltar" onClick={() => setCriando(false)}><IconeVoltar />Já tenho conta</button>
            <h1 id="titulo-passo" ref={tituloRef} tabIndex={-1}>Quem vai usar?</h1>
            <p className="bv-sub">Escolha o seu perfil para criar a conta.</p>
            <ul className="bv-perfis">
              {PERFIS.map(({ id, titulo, descricao, Icone }) => (
                <li key={id}>
                  <button type="button" className={'bv-perfil' + (perfil === id ? ' escolhido' : '')} onClick={() => escolherPerfil(id)}>
                    <span className="bv-perfil-icone" aria-hidden="true"><Icone /></span>
                    <span className="bv-perfil-texto">
                      <strong>{titulo}</strong>
                      <small>{descricao}</small>
                    </span>
                    <SetaDireita />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {criando && passo === 2 && (
          <section className="bv-largo" aria-labelledby="titulo-passo">
            <button type="button" className="voltar" onClick={() => irPara(1)}><IconeVoltar />Voltar</button>
            <h1 id="titulo-passo" ref={tituloRef} tabIndex={-1}>Seus dados</h1>
            <p className="bv-sub">Você vai usar o e-mail e a senha para entrar.</p>
            <form className="formulario" onSubmit={enviarDados} noValidate>
              <Campo rotulo="Nome completo" type="text" autoComplete="name" value={dados.nome}
                onChange={(e) => mudarDado('nome', e.target.value)} erro={erros.nome} />
              <Campo rotulo="Celular" opcional type="tel" inputMode="tel" autoComplete="tel" placeholder="(31) 99999-9999" value={dados.telefone}
                onChange={(e) => mudarDado('telefone', mascararTelefone(e.target.value))} erro={erros.telefone} />
              <Campo rotulo="E-mail" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" value={dados.email}
                onChange={(e) => mudarDado('email', e.target.value)} erro={erros.email} />
              <CampoSenha autoComplete="new-password" value={dados.senha} onChange={(e) => mudarDado('senha', e.target.value)}
                erro={erros.senha} dica="8 caracteres ou mais. Uma frase curta é fácil de lembrar." />
              <button type="submit" className="btn btn-primario btn-bloco">Continuar</button>
            </form>
          </section>
        )}

        {criando && passo === 3 && (
          <section className="bv-largo" aria-labelledby="titulo-passo">
            <button type="button" className="voltar" onClick={() => irPara(2)}><IconeVoltar />Voltar</button>
            <form className="bv-form3" onSubmit={concluir} noValidate>
              <Passo3 perfil={perfil} primeiroNome={dados.nome.trim().split(/\s+/)[0]} p={p} mudar={mudar} erros={erros} tituloRef={tituloRef} />
              {erros.geral && <p className="erro-form" role="alert">{erros.geral}</p>}
              <button type="submit" className="btn btn-primario btn-bloco" disabled={enviando}>
                <IconeCheck />{enviando ? 'Criando a conta…' : 'Criar conta'}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
