/* O que cada perfil vê e pode fazer.
   Perfis: 'idoso', 'cliente' (familiar responsável) e 'cuidador' (profissional).
   O perfil vem das boas-vindas (preferencias.js). Quem ainda não escolheu é tratado como
   familiar, que tem acesso a tudo.

   Atenção: esconder telas e botões no front NÃO é segurança, só organiza a interface.
   Quando o login existir, cada API precisa conferir o papel do usuário antes de gravar. */
import { usePreferencias } from './preferencias.js';

export const PERFIL_PADRAO = 'cliente';

/* telas que cada perfil acessa (ids usados no Shell) */
const TELAS = {
  idoso: ['inicio', 'agenda', 'medicamentos', 'linha-do-tempo', 'perfis', 'cuidadores'],
  cliente: ['inicio', 'agenda', 'medicamentos', 'cadastro-medicamentos', 'tarefas', 'linha-do-tempo', 'perfis', 'cuidadores'],
  cuidador: ['inicio', 'agenda', 'medicamentos', 'tarefas', 'linha-do-tempo', 'perfis'],
};

/* ações dentro das telas */
const ACOES = {
  idoso: [
    'medicamentos.registrar',
    'inicio.concluir', 'inicio.ajuda',
    'cuidadores.solicitar', 'cuidadores.avaliar',
  ],
  cliente: [
    'agenda.criar', 'agenda.editar', 'agenda.concluir',
    'medicamentos.registrar', 'medicamentos.cadastrar',
    'tarefas.criar', 'tarefas.todas', 'tarefas.mudarStatus', 'tarefas.compras',
    'inicio.concluir', 'inicio.anotar', 'inicio.ajuda', 'inicio.gestao',
    'linha.marcarVisto', 'linha.plantao',
    'perfil.editar',
    'cuidadores.solicitar', 'cuidadores.avaliar',
  ],
  cuidador: [
    'agenda.concluir',
    'medicamentos.registrar',
    'tarefas.mudarStatus', 'tarefas.compras',
    'inicio.concluir', 'inicio.anotar', 'inicio.ajuda',
    'linha.marcarVisto', 'linha.plantao',
  ],
};

export const NOMES_PERFIL = { idoso: 'Idoso(a)', cliente: 'Familiar responsável', cuidador: 'Cuidador(a)' };

export function perfilValido(perfil) {
  return TELAS[perfil] ? perfil : PERFIL_PADRAO;
}

export function podeVerTela(perfil, tela) {
  return TELAS[perfilValido(perfil)].includes(tela);
}

export function podeFazer(perfil, acao) {
  return ACOES[perfilValido(perfil)].includes(acao);
}

/* hook para as telas: const { perfil, pode } = usePermissoes(); if (pode('agenda.criar')) ... */
export function usePermissoes() {
  const [prefs] = usePreferencias();
  const perfil = perfilValido(prefs.perfil);
  return {
    perfil,
    pode: (acao) => podeFazer(perfil, acao),
    podeVer: (tela) => podeVerTela(perfil, tela),
  };
}
