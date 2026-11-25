import { useEffect, useRef, useState } from 'react';
import {
  IconeCheck, IconeContraste, IconeCuidadores, IconeEscudo, IconeLetra, IconePerfis, IconeVoltar, SetaDireita,
} from '@ds/Icones.jsx';
import { TELAS } from '@ds/navegacao.js';
import { lerPreferencias, usePreferencias } from '@ds/preferencias.js';
import logo from '@ds/assets/logo-acessamob.png';

/* Boas-vindas e cadastro inicial em 3 passos: perfil → seus dados → acessibilidade (idoso e
   familiar) ou experiência (cuidador). Antes os dados só iam para o console.log; agora o perfil,
   o nome e as preferências ficam guardados neste aparelho e valem em todas as telas. */

const PERFIS = [
  { id: 'idoso', titulo: 'Sou idoso(a)', descricao: 'Quero mais autonomia e segurança no dia a dia', Icone: IconePerfis },
  { id: 'cliente', titulo: 'Sou familiar ou responsável', descricao: 'Quero acompanhar e cuidar de quem eu amo', Icone: IconeCuidadores },
  { id: 'cuidador', titulo: 'Sou cuidador(a) profissional', descricao: 'Quero oferecer meus serviços e encontrar famílias', Icone: IconeEscudo },
];

const MOBILIDADE = [
  { id: 'nenhuma', rotulo: 'Nenhum apoio' },
  { id: 'andador', rotulo: 'Andador' },
  { id: 'muletas', rotulo: 'Muletas' },
  { id: 'cadeira-manual', rotulo: 'Cadeira de rodas manual' },
  { id: 'cadeira-motorizada', rotulo: 'Cadeira motorizada' },
];

const EXPERIENCIAS = [
  { valor: '0-1', rotulo: 'Menos de 1 ano' },
  { valor: '1-3', rotulo: '1 a 3 anos' },
  { valor: '3-5', rotulo: '3 a 5 anos' },
  { valor: '5-10', rotulo: '5 a 10 anos' },
  { valor: '10+', rotulo: 'Mais de 10 anos' },
];

const SERVICOS = [
  { id: 'acompanhante', rotulo: 'Acompanhante' },
  { id: 'companhia', rotulo: 'Companhia' },
  { id: 'tecnico-enfermagem', rotulo: 'Técnico de enfermagem' },
  { id: 'outro', rotulo: 'Outro' },
];

const DIAS = [
  { id: 'seg', rotulo: 'Seg', nome: 'Segunda' },
  { id: 'ter', rotulo: 'Ter', nome: 'Terça' },
  { id: 'qua', rotulo: 'Qua', nome: 'Quarta' },
  { id: 'qui', rotulo: 'Qui', nome: 'Quinta' },
  { id: 'sex', rotulo: 'Sex', nome: 'Sexta' },
  { id: 'sab', rotulo: 'Sáb', nome: 'Sábado' },
  { id: 'dom', rotulo: 'Dom', nome: 'Domingo' },
];

/* máscara simples de telefone brasileiro: (31) 99999-9999 */
function mascararTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? '(' + d : '';
  if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
}

/* nome e sobrenome, só com letras (aceita acento, hífen, apóstrofo e abreviação) */
function nomeValido(nome) {
  const partes = nome.trim().split(/\s+/);
  return partes.length >= 2 && partes.every((p) => /^\p{L}[\p{L}\p{M}'’.-]*$/u.test(p));
}

/* DDD sem zero + celular (9 dígitos, começa com 9) ou fixo (8 dígitos, começa de 2 a 5) */
function telefoneValido(telefone) {
  return /^[1-9]{2}(9\d{8}|[2-5]\d{7})$/.test(telefone.replace(/\D/g, ''));
}

function Passos({ atual }) {
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

function Interruptor({ Icone, rotulo, descricao, ligado, aoMudar }) {
  return (
    <label className="interruptor">
      <span className="interruptor-icone" aria-hidden="true"><Icone /></span>
      <span className="interruptor-texto">
        <strong>{rotulo}</strong>
        <small>{descricao}</small>
      </span>
      <input type="checkbox" role="switch" checked={ligado} onChange={(e) => aoMudar(e.target.checked)} />
    </label>
  );
}

function Acessibilidade({ prefs, salvarPrefs }) {
  return (
    <div className="acessibilidade">
      <Interruptor Icone={IconeLetra} rotulo="Letra maior" descricao="Aumenta todos os textos"
        ligado={prefs.fonteMaior} aoMudar={(v) => salvarPrefs({ fonteMaior: v })} />
      <Interruptor Icone={IconeContraste} rotulo="Alto contraste" descricao="Cores mais fortes, bordas mais visíveis"
        ligado={prefs.altoContraste} aoMudar={(v) => salvarPrefs({ altoContraste: v })} />
    </div>
  );
}

export default function App() {
  const salvo = lerPreferencias();
  const [passo, setPasso] = useState(1);
  const [perfil, setPerfil] = useState(salvo.perfil);
  const [dados, setDados] = useState({ nome: salvo.nome || '', telefone: salvo.telefone || '' });
  const [erros, setErros] = useState({});
  const [mobilidade, setMobilidade] = useState('nenhuma');
  const [cuidador, setCuidador] = useState({ experiencia: '', servicos: [], dias: [], inicio: '08:00', fim: '18:00' });
  const [prefs, salvarPrefs] = usePreferencias();
  const tituloRef = useRef(null);

  /* a cada passo o foco vai para o título, para leitores de tela anunciarem a mudança */
  useEffect(() => {
    tituloRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [passo]);

  function escolherPerfil(id) {
    setPerfil(id);
    setPasso(2);
  }

  function enviarDados(e) {
    e.preventDefault();
    const novos = {};
    if (!nomeValido(dados.nome)) novos.nome = 'Escreva nome e sobrenome, só com letras.';
    if (dados.telefone && !telefoneValido(dados.telefone)) novos.telefone = 'Confira o telefone com DDD.';
    setErros(novos);
    if (Object.keys(novos).length) {
      e.currentTarget.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    setPasso(3);
  }

  function alternar(lista, valor) {
    setCuidador((c) => ({ ...c, [lista]: c[lista].includes(valor) ? c[lista].filter((v) => v !== valor) : [...c[lista], valor] }));
  }

  function concluir(e) {
    e.preventDefault();
    if (perfil === 'cuidador') {
      const novos = {};
      if (!cuidador.experiencia) novos.experiencia = 'Escolha o tempo de experiência.';
      if (!cuidador.servicos.length) novos.servicos = 'Escolha pelo menos um serviço.';
      if (!cuidador.dias.length) novos.dias = 'Escolha pelo menos um dia.';
      if (!cuidador.inicio || !cuidador.fim) novos.horas = 'Preencha os dois horários.';
      else if (cuidador.inicio === cuidador.fim) novos.horas = 'O fim precisa ser diferente do início.';
      setErros(novos);
      const primeiro = Object.keys(novos)[0];
      if (primeiro) {
        e.currentTarget.querySelector(`[data-campo="${primeiro}"]`)?.focus();
        return;
      }
    }
    salvarPrefs({
      perfil,
      nome: dados.nome.trim(),
      telefone: dados.telefone,
      mobilidade: perfil === 'cuidador' ? undefined : mobilidade,
      cuidador: perfil === 'cuidador' ? cuidador : undefined,
    });
    /* todos começam pelo Início; o menu de cada um mostra só as telas do seu perfil */
    window.location.assign(TELAS.inicio);
  }

  const primeiroNome = dados.nome.trim().split(/\s+/)[0];

  return (
    <div className="boas-vindas">
      <header className="bv-marca">
        <img src={logo} alt="" width="56" height="56" />
        <div>
          <span className="bv-nome">AcessaMob</span>
          <span className="bv-slogan">Mais cuidado, todos os dias.</span>
        </div>
      </header>

      <main className="bv-conteudo">
        <Passos atual={passo} />

        {passo === 1 && (
          <section aria-labelledby="titulo-passo">
            <h1 id="titulo-passo" ref={tituloRef} tabIndex={-1}>Boas-vindas! Quem está usando?</h1>
            <p className="bv-sub">Escolha o seu perfil para começar. Dá para mudar depois.</p>
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
            {salvo.perfil && (
              <a className="btn btn-texto bv-pular" href={TELAS.inicio}>
                Continuar como {salvo.nome ? salvo.nome.split(' ')[0] : 'antes'}
              </a>
            )}
          </section>
        )}

        {passo === 2 && (
          <section aria-labelledby="titulo-passo">
            <button type="button" className="voltar" onClick={() => setPasso(1)}><IconeVoltar />Voltar</button>
            <h1 id="titulo-passo" ref={tituloRef} tabIndex={-1}>Seus dados</h1>
            <p className="bv-sub">Assim a rede de apoio sabe quem é você.</p>
            <form className="formulario" onSubmit={enviarDados} noValidate>
              <label className="campo">
                Nome completo
                <input
                  type="text"
                  autoComplete="name"
                  value={dados.nome}
                  onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                  aria-invalid={erros.nome ? 'true' : undefined}
                  aria-describedby={erros.nome ? 'erro-nome' : undefined}
                />
                {erros.nome && <span className="campo-erro" id="erro-nome">{erros.nome}</span>}
              </label>
              <label className="campo">
                <span>Celular <small>(opcional)</small></span>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(31) 99999-9999"
                  value={dados.telefone}
                  onChange={(e) => setDados({ ...dados, telefone: mascararTelefone(e.target.value) })}
                  aria-invalid={erros.telefone ? 'true' : undefined}
                  aria-describedby={erros.telefone ? 'erro-tel' : undefined}
                />
                {erros.telefone && <span className="campo-erro" id="erro-tel">{erros.telefone}</span>}
              </label>
              <button type="submit" className="btn btn-primario btn-bloco">Continuar</button>
            </form>
          </section>
        )}

        {passo === 3 && perfil !== 'cuidador' && (
          <section aria-labelledby="titulo-passo">
            <button type="button" className="voltar" onClick={() => setPasso(2)}><IconeVoltar />Voltar</button>
            <h1 id="titulo-passo" ref={tituloRef} tabIndex={-1}>Como fica melhor para você{primeiroNome ? ', ' + primeiroNome : ''}?</h1>
            <p className="bv-sub">As mudanças valem na hora, em todas as telas.</p>
            <form className="formulario" onSubmit={concluir}>
              <Acessibilidade prefs={prefs} salvarPrefs={salvarPrefs} />

              <fieldset className="campo bv-fieldset">
                <legend>{perfil === 'idoso' ? 'Você usa algum apoio para se locomover?' : 'A pessoa cuidada usa algum apoio para se locomover?'}</legend>
                <div className="pilulas">
                  {MOBILIDADE.map((m) => (
                    <label key={m.id} className="pilula">
                      <input type="radio" name="mobilidade" value={m.id} checked={mobilidade === m.id} onChange={() => setMobilidade(m.id)} />
                      {m.rotulo}
                    </label>
                  ))}
                </div>
              </fieldset>

              <button type="submit" className="btn btn-primario btn-bloco"><IconeCheck />Começar a usar</button>
            </form>
          </section>
        )}

        {passo === 3 && perfil === 'cuidador' && (
          <section aria-labelledby="titulo-passo">
            <button type="button" className="voltar" onClick={() => setPasso(2)}><IconeVoltar />Voltar</button>
            <h1 id="titulo-passo" ref={tituloRef} tabIndex={-1}>Sua experiência</h1>
            <p className="bv-sub">Conte como você trabalha e quando pode atender.</p>
            <form className="formulario" onSubmit={concluir} noValidate>
              <label className="campo">
                Tempo de experiência com cuidado
                <select data-campo="experiencia" value={cuidador.experiencia}
                  aria-invalid={erros.experiencia ? 'true' : undefined} aria-describedby={erros.experiencia ? 'erro-experiencia' : undefined}
                  onChange={(e) => setCuidador({ ...cuidador, experiencia: e.target.value })}>
                  <option value="">Escolha</option>
                  {EXPERIENCIAS.map((x) => <option key={x.valor} value={x.valor}>{x.rotulo}</option>)}
                </select>
                {erros.experiencia && <span className="campo-erro" id="erro-experiencia">{erros.experiencia}</span>}
              </label>

              <fieldset className="campo bv-fieldset" aria-describedby={erros.servicos ? 'erro-servicos' : undefined}>
                <legend>Serviços que você oferece</legend>
                <div className="pilulas">
                  {SERVICOS.map((s, i) => (
                    <label key={s.id} className="pilula">
                      <input type="checkbox" data-campo={i === 0 ? 'servicos' : undefined} checked={cuidador.servicos.includes(s.id)} onChange={() => alternar('servicos', s.id)} />
                      {s.rotulo}
                    </label>
                  ))}
                </div>
                {erros.servicos && <span className="campo-erro" id="erro-servicos">{erros.servicos}</span>}
              </fieldset>

              <fieldset className="campo bv-fieldset" aria-describedby={erros.dias ? 'erro-dias' : undefined}>
                <legend>Dias em que pode atender</legend>
                <div className="bv-dias">
                  {DIAS.map((d, i) => (
                    <label key={d.id} className="bv-dia" title={d.nome}>
                      <input type="checkbox" data-campo={i === 0 ? 'dias' : undefined} checked={cuidador.dias.includes(d.id)} onChange={() => alternar('dias', d.id)} aria-label={d.nome} />
                      <span aria-hidden="true">{d.rotulo}</span>
                    </label>
                  ))}
                </div>
                {erros.dias && <span className="campo-erro" id="erro-dias">{erros.dias}</span>}
              </fieldset>

              <div className="campos-linha bv-horas">
                <label className="campo">
                  Das
                  <input type="time" data-campo="horas" aria-invalid={erros.horas ? 'true' : undefined} value={cuidador.inicio} onChange={(e) => setCuidador({ ...cuidador, inicio: e.target.value })} />
                </label>
                <label className="campo">
                  Até
                  <input type="time" value={cuidador.fim} onChange={(e) => setCuidador({ ...cuidador, fim: e.target.value })} />
                </label>
              </div>

              {erros.horas && <p className="erro-form" role="alert">{erros.horas}</p>}
              {cuidador.fim && cuidador.fim < cuidador.inicio && (
                <p className="bv-noturno">Plantão noturno: até {cuidador.fim} do dia seguinte.</p>
              )}

              <Acessibilidade prefs={prefs} salvarPrefs={salvarPrefs} />

              <button type="submit" className="btn btn-primario btn-bloco"><IconeCheck />Concluir cadastro</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
