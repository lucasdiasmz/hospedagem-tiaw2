import { useEffect, useState } from 'react';
import Acessibilidade from './Acessibilidade.jsx';
import Dialogo from './Dialogo.jsx';
import {
  IconeAgenda, IconeCuidadores, IconeInicio, IconeLinhaDoTempo,
  IconeMenu, IconePerfis, IconePilula, IconeSair, IconeTarefas,
} from './Icones.jsx';
import { LOCAL, SITE_UNICO, TELAS } from './navegacao.js';
import { usePreferencias, useUsuario } from './preferencias.js';
import { NOMES_PERFIL, usePermissoes } from './permissoes.js';
import { irParaEntrada, sair } from './sessao.js';
import { Estado } from './Componentes.jsx';
import logo from './assets/logo-acessamob.png';

/* Estrutura comum de todas as telas (mobile-first):
   - celular e tablet: barra do topo com a marca, conteúdo e barra de abas embaixo com as
     4 telas mais usadas + "Mais" (folha com as outras telas, atalhos e acessibilidade);
   - computador (≥ 1024 px): menu lateral claro, em grupos, com tudo à vista e o conteúdo preso à altura da
     janela (.palco); cada tela escolhe qual lista rola por dentro (.rolavel).
   Props: tela (id do item ativo), usuario ({ nome, tipo }), atalhos (ações que, no celular, só existem na folha "Mais": [{ rotulo, Icone, aoClicar | href }]),
   permissao (id da tela para conferir o acesso, quando difere de "tela"; ex.: cadastro de medicamentos).
   O menu mostra só as telas do perfil (permissoes.js); uma tela proibida mostra um aviso.
   Quem ainda não escolheu um perfil vai para as boas-vindas. */

const ITENS = [
  { id: 'inicio', rotulo: 'Início', curto: 'Início', Icone: IconeInicio, href: TELAS.inicio, grupo: 'Rotina', aba: true },
  { id: 'agenda', rotulo: 'Agenda', curto: 'Agenda', Icone: IconeAgenda, href: TELAS.agenda, grupo: 'Rotina', aba: true },
  { id: 'medicamentos', rotulo: 'Medicamentos', curto: 'Remédios', Icone: IconePilula, href: TELAS.medicamentos, grupo: 'Rotina', aba: true },
  { id: 'tarefas', rotulo: 'Tarefas', curto: 'Tarefas', Icone: IconeTarefas, href: TELAS.tarefas, grupo: 'Rotina', aba: true },
  { id: 'linha-do-tempo', rotulo: 'Linha do tempo', Icone: IconeLinhaDoTempo, href: TELAS.linhaDoTempo, grupo: 'Pessoa cuidada' },
  { id: 'perfis', rotulo: 'Perfil do idoso', Icone: IconePerfis, href: TELAS.perfis, grupo: 'Pessoa cuidada' },
  { id: 'cuidadores', rotulo: 'Cuidadores', Icone: IconeCuidadores, href: TELAS.cuidadores, grupo: 'Rede' },
];

const GRUPOS = ['Rotina', 'Pessoa cuidada', 'Rede'];

function primeiroNome(nome = '') {
  return nome.trim().split(/\s+/)[0] || '';
}

function Marca({ compacta = false }) {
  return (
    <a className={'marca' + (compacta ? ' marca--compacta' : '')} href={TELAS.inicio}>
      <span className="marca-logo"><img src={logo} alt="" width="44" height="44" /></span>
      <span>
        <span className="marca-nome">AcessaMob</span>
        {!compacta && <small className="marca-slogan">Mais cuidado, todos os dias.</small>}
      </span>
    </a>
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

function CartaoUsuario({ usuario, perfil, aoSair }) {
  if (!usuario?.nome) return null;
  return (
    <div className="usuario">
      <span className="avatar" aria-hidden="true">{usuario.nome[0]}</span>
      <span className="usuario-texto">
        <strong>{usuario.nome}</strong>
        <small>{NOMES_PERFIL[perfil]}</small>
      </span>
      <button type="button" className="usuario-sair" aria-label="Sair da conta" onClick={aoSair}>
        <IconeSair />
        Sair
      </button>
    </div>
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
    if (semPerfil) irParaEntrada();
  }, [semPerfil]);

  const itens = ITENS.filter((i) => podeVer(i.id));
  const abas = itens.filter((i) => i.aba);
  const atualNoMais = itens.some((i) => !i.aba && i.id === tela);
  const liberada = podeVer(permissao);
  const visiveis = liberada ? atalhos : [];

  /* sair pede rede: só o servidor apaga o cookie da sessão */
  function encerrar() {
    sair().catch((e) => window.alert('Não foi possível sair. ' + e.message));
  }

  if (semPerfil) return <Estado tipo="carregando" titulo="Abrindo as boas-vindas…" />;

  return (
    <div className="shell">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>

      {/* computador: menu lateral */}
      <aside className="lateral" aria-label="Menu">
        <Marca />
        <nav className="lateral-menu" aria-label="Navegação principal">
          {GRUPOS.map((grupo) => {
            const doGrupo = itens.filter((i) => i.grupo === grupo);
            if (!doGrupo.length) return null;
            return (
              <div key={grupo} className="lateral-grupo" role="group" aria-label={grupo}>
                <p className="lateral-rotulo" aria-hidden="true">{grupo}</p>
                <ul>
                  {doGrupo.map(({ id, rotulo, Icone, href }) => (
                    <li key={id}>
                      <a href={href} className="lateral-item" aria-current={id === tela ? 'page' : undefined}>
                        <Icone />
                        <span>{rotulo}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <Acessibilidade />

        <CartaoUsuario usuario={usuario} perfil={perfil} aoSair={encerrar} />
      </aside>

      {/* celular: barra do topo */}
      <header className="topo">
        <Marca compacta />
        <button type="button" className="topo-perfil" onClick={() => setMaisAberto(true)} aria-label="Abrir menu e acessibilidade">
          {usuario?.nome ? <span className="avatar" aria-hidden="true">{usuario.nome[0]}</span> : <IconeMenu />}
          {usuario?.nome && <span className="topo-nome">{primeiroNome(usuario.nome)}</span>}
        </button>
      </header>

      <div className="palco">
        <main id="conteudo" className="conteudo" tabIndex={-1}>
          {liberada ? children : (
            <Estado
              titulo="Esta tela não faz parte do seu perfil"
              acao={<a className="btn btn-primario" href={TELAS.inicio}>Ir para o Início</a>}
            >
              <p>
                Você está usando o AcessaMob como <strong>{NOMES_PERFIL[perfil].toLowerCase()}</strong>.
              </p>
            </Estado>
          )}
        </main>
      </div>

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
            {itens.filter((i) => !i.aba).map(({ id, rotulo, Icone, href }) => (
              <li key={id}>
                <a href={href} className="menu-mais-item" aria-current={id === tela ? 'page' : undefined}>
                  <span className="menu-mais-icone"><Icone /></span>
                  <span>{rotulo}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {visiveis.length > 0 && (
          <div className="menu-atalhos">
            {visiveis.map((a) => <Atalho key={a.rotulo} atalho={a} aoUsar={() => setMaisAberto(false)} />)}
          </div>
        )}

        <Acessibilidade />

        <CartaoUsuario usuario={usuario} perfil={perfil} aoSair={encerrar} />
      </Dialogo>
    </div>
  );
}
