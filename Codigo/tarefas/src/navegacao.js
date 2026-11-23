/* Endereços das telas e das APIs do AcessaMob.
   No computador (localhost) cada tela roda no seu servidor do Vite (tabela de portas em Codigo/README.md).
   Publicado, as telas ficam na Vercel (acessamob-<tela>.vercel.app) e as APIs no Render
   (acessamob-<api>-api.onrender.com); veja Codigo/HOSPEDAGEM.md.
   Este arquivo é igual em todos os módulos: ao mudar aqui, mude nos outros também.
   As variáveis VITE_URL_* e VITE_API_URL, se definidas, têm prioridade. */
const env = import.meta.env;

export const LOCAL = ['localhost', '127.0.0.1'].includes(window.location.hostname);

function tela(porta, nome, caminho = '/') {
  return LOCAL ? 'http://localhost:' + porta + caminho : 'https://acessamob-' + nome + '.vercel.app' + caminho;
}

export const TELAS = {
  boasVindas: env.VITE_URL_BOAS_VINDAS || tela(5180, 'boas-vindas'),
  inicio: env.VITE_URL_HOMEPAGE || tela(5173, 'inicio'),
  agenda: env.VITE_URL_AGENDA || tela(5174, 'agenda'),
  medicamentos: env.VITE_URL_MEDICAMENTOS || tela(5177, 'medicamentos'),
  cadastroMedicamentos: env.VITE_URL_CADASTRO_MEDICAMENTOS || tela(5175, 'cadastro'),
  tarefas: env.VITE_URL_TAREFAS || tela(5176, 'tarefas'),
  linhaDoTempo: env.VITE_URL_LINHA_DO_TEMPO || tela(5179, 'perfil', '/linha-do-tempo'),
  cuidadores: env.VITE_URL_CUIDADORES || tela(5178, 'cuidadores'),
  perfis: env.VITE_URL_PERFIS || tela(5179, 'perfil', '/perfil'),
};

/* endereço base da API de cada tela; localmente fica vazio ou no localhost, como antes */
export function urlApi(nome, local = '') {
  return env.VITE_API_URL || (LOCAL ? local : 'https://acessamob-' + nome + '-api.onrender.com');
}
