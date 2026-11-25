import { useEffect, useState } from 'react';
import Dialogo from './Dialogo.jsx';
import {
  IconeAgenda, IconeContraste, IconeCuidadores, IconeInicio, IconeLetra, IconeLinhaDoTempo,
  IconeMenu, IconePerfis, IconePilula, IconeSair, IconeTarefas, SetaDireita,
} from './Icones.jsx';
import { LOCAL, SITE_UNICO, TELAS } from './navegacao.js';
import { usePreferencias, useUsuario } from './preferencias.js';
import { NOMES_PERFIL, usePermissoes } from './permissoes.js';
import { Estado } from './Componentes.jsx';
import logo from './assets/logo-acessamob.png';

/* Estrutura comum de todas as telas (mobile-first):
   - celular e tablet: barra do topo com a marca, conteúdo e barra de abas embaixo com as
     4 telas mais usadas + "Mais" (folha com as outras telas, atalhos e acessibilidade);
   - computador (≥ 1024 px): menu lateral azul-escuro com tudo à vista.
   Props: tela (id do item ativo), usuario ({ nome, tipo }), atalhos ([{ rotulo, Icone, aoClicar | href }]),
   permissao (id da tela para conferir o acesso, quando difere de "tela"; ex.: cadastro de medicamentos).
   O menu mostra só as telas do perfil (permissoes.js); uma tela proibida mostra um aviso.
   Quem ainda não escolheu um perfil vai para as boas-vindas. */

const ITENS = [
  { id: 'inicio', rotulo: 'Início', curto: 'Início', Icone: IconeInicio, href: TELAS.inicio, aba: true },
  { id: 'agenda', rotulo: 'Agenda', curto: 'Agenda', Icone: IconeAgenda, href: TELAS.agenda, aba: true },
  { id: 'medicamentos', rotulo: 'Medicamentos', curto: 'Remédios', Icone: IconePilula, href: TELAS.medicamentos, aba: true },
  { id: 'tarefas', rotulo: 'Tarefas', curto: 'Tarefas', Icone: IconeTarefas, href: TELAS.tarefas, aba: true },
  { id: 'linha-do-tempo', rotulo: 'Linha do tempo', descricao: 'O que aconteceu no dia', Icone: IconeLinhaDoTempo, href: TELAS.linhaDoTempo },
  { id: 'cuidadores', rotulo: 'Cuidadores', descricao: 'Buscar e contratar', Icone: IconeCuidadores, href: TELAS.cuidadores },
  { id: 'perfis', rotulo: 'Perfil do idoso', descricao: 'Saúde, contatos e equipe', Icone: IconePerfis, href: TELAS.perfis },
];

function primeiroNome(nome = '') {
  return nome.trim().split(/\s+/)[0] || '';
}

function Marca({ compacta = false }) {
  return (
    <a className={'marca' + (compacta ? ' marca--compacta' : '')} href={TELAS.inicio}>
      <img src={logo} alt="" width={compacta ? 34 : 44} height={compacta ? 34 : 44} />
      <span>
        <span className="marca-nome">AcessaMob</span>
        {!compacta && <small className="marca-slogan">Mais cuidado, todos os dias.</small>}
      </span>
    </a>
  );
}

function Interruptor({ Icone, rotulo, descricao, ligado, aoMudar }) {
  return (
    <label className="interruptor">
      <span className="interruptor-icone" aria-hidden="true"><Icone /></span>
      <span className="interruptor-texto">
        <strong>{rotulo}</strong>
        {descricao && <small>{descricao}</small>}
      </span>
      <input type="checkbox" role="switch" checked={ligado} onChange={(e) => aoMudar(e.target.checked)} />
    </label>
  );
}

function Acessibilidade() {
  const [prefs, salvar] = usePreferencias();
  return (
    <div className="acessibilidade">
      <Interruptor
        Icone={IconeLetra}
        rotulo="Letra maior"
        descricao="Aumenta todos os textos"
        ligado={prefs.fonteMaior}
        aoMudar={(v) => salvar({ fonteMaior: v })}
      />
      <Interruptor
        Icone={IconeContraste}
        rotulo="Alto contraste"
        descricao="Cores mais fortes"
        ligado={prefs.altoContraste}
        aoMudar={(v) => salvar({ altoContraste: v })}
      />
    </div>
  );
}

function Atalho({ atalho, aoUsar }) {
  const { rotulo, Icone, aoClicar, href } = atalho;
  const conteudo = (
    <>
      {Icone && <Icone />}
      <span>{rotulo}</span>
    </>
  );
  if (href) return <a className="atalho" href={href}>{conteudo}</a>;
  return (
    <button type="button" className="atalho" onClick={() => { aoUsar?.(); aoClicar?.(); }}>
      {conteudo}
    </button>
  );
}

function CartaoUsuario({ usuario, perfil, escuro = false }) {
  if (!usuario?.nome) return null;
  return (
    <a className={'usuario' + (escuro ? ' usuario--escuro' : '')} href={TELAS.boasVindas} title="Trocar de perfil">
      <span className="avatar" aria-hidden="true">{usuario.nome[0]}</span>
      <span className="usuario-texto">
        <strong>{usuario.nome}</strong>
        <small>{NOMES_PERFIL[perfil]} · trocar</small>
      </span>
      <IconeSair />
    </a>
  );
}

/* com um endereço por tela o cookie do perfil não é compartilhado, e redirecionar daria volta sem fim */
const EXIGE_PERFIL = SITE_UNICO || LOCAL;

export default function Shell({ tela, permissao = tela, usuario: usuarioApi, atalhos = [], children }) {
  const [maisAberto, setMaisAberto] = useState(false);
  const usuario = useUsuario(usuarioApi);
  const { perfil, podeVer } = usePermissoes();
  const [prefs] = usePreferencias();
  const semPerfil = EXIGE_PERFIL && !prefs.perfil;

  useEffect(() => {
    if (semPerfil) window.location.replace(TELAS.boasVindas);
  }, [semPerfil]);

  const itens = ITENS.filter((i) => podeVer(i.id));
  const abas = itens.filter((i) => i.aba);
  const atualNoMais = itens.some((i) => !i.aba && i.id === tela);
  const liberada = podeVer(permissao);
  const visiveis = liberada ? atalhos : [];

  if (semPerfil) return <Estado tipo="carregando" titulo="Abrindo as boas-vindas…" />;

  return (
    <div className="shell">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>

      {/* computador: menu lateral */}
      <aside className="lateral" aria-label="Menu">
        <Marca />
        <nav className="lateral-menu" aria-label="Navegação principal">
          <ul>
            {itens.map(({ id, rotulo, Icone, href }) => (
              <li key={id}>
                <a href={href} className="lateral-item" aria-current={id === tela ? 'page' : undefined}>
                  <Icone />
                  <span>{rotulo}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {visiveis.length > 0 && (
          <div className="lateral-bloco">
            <p className="lateral-rotulo">Atalhos</p>
            <div className="lateral-atalhos">
              {visiveis.map((a) => <Atalho key={a.rotulo} atalho={a} />)}
            </div>
          </div>
        )}

        <div className="lateral-bloco lateral-acessibilidade">
          <p className="lateral-rotulo">Acessibilidade</p>
          <Acessibilidade />
        </div>

        <CartaoUsuario usuario={usuario} perfil={perfil} escuro />
      </aside>

      {/* celular: barra do topo */}
      <header className="topo">
        <Marca compacta />
        <button type="button" className="topo-perfil" onClick={() => setMaisAberto(true)} aria-label="Abrir menu e acessibilidade">
          {usuario?.nome ? <span className="avatar" aria-hidden="true">{usuario.nome[0]}</span> : <IconeMenu />}
          {usuario?.nome && <span className="topo-nome">{primeiroNome(usuario.nome)}</span>}
        </button>
      </header>

      <main id="conteudo" className="conteudo" tabIndex={-1}>
        {liberada ? children : (
          <Estado
            titulo="Esta tela não faz parte do seu perfil"
            acao={<a className="btn btn-primario" href={TELAS.inicio}>Ir para o Início</a>}
          >
            <p>
              Você está usando o AcessaMob como <strong>{NOMES_PERFIL[perfil].toLowerCase()}</strong>.
              Se o perfil estiver errado, <a href={TELAS.boasVindas}>troque nas boas-vindas</a>.
            </p>
          </Estado>
        )}
      </main>

      {/* celular: abas de baixo */}
      <nav className="abas" aria-label="Navegação principal" style={{ '--abas-n': abas.length + 1 }}>
        {abas.map(({ id, curto, Icone, href }) => (
          <a key={id} href={href} className="aba" aria-current={id === tela ? 'page' : undefined}>
            <Icone />
            <span>{curto}</span>
          </a>
        ))}
        <button
          type="button"
          className="aba"
          aria-haspopup="dialog"
          aria-current={atualNoMais ? 'page' : undefined}
          onClick={() => setMaisAberto(true)}
        >
          <IconeMenu />
          <span>Mais</span>
        </button>
      </nav>

      <Dialogo aberto={maisAberto} aoFechar={() => setMaisAberto(false)} titulo="Menu" className="dialogo--menu">
        <nav aria-label="Outras telas">
          <ul className="menu-mais">
            {itens.filter((i) => !i.aba).map(({ id, rotulo, descricao, Icone, href }) => (
              <li key={id}>
                <a href={href} className="menu-mais-item" aria-current={id === tela ? 'page' : undefined}>
                  <span className="menu-mais-icone"><Icone /></span>
                  <span className="menu-mais-texto"><strong>{rotulo}</strong><small>{descricao}</small></span>
                  <SetaDireita />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {visiveis.length > 0 && (
          <section className="menu-secao" aria-labelledby="menu-atalhos">
            <h3 id="menu-atalhos">Atalhos desta tela</h3>
            <div className="menu-atalhos">
              {visiveis.map((a) => <Atalho key={a.rotulo} atalho={a} aoUsar={() => setMaisAberto(false)} />)}
            </div>
          </section>
        )}

        <section className="menu-secao" aria-labelledby="menu-acess">
          <h3 id="menu-acess">Acessibilidade</h3>
          <Acessibilidade />
        </section>

        <CartaoUsuario usuario={usuario} perfil={perfil} />
      </Dialogo>
    </div>
  );
}
