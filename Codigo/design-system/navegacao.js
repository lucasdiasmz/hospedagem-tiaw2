/* Endereços das telas e das APIs do AcessaMob — arquivo único, usado por todas as telas
   (antes havia uma cópia igual em cada módulo).
   Três jeitos de rodar:
   - no computador (localhost): cada tela no seu servidor do Vite (portas em Codigo/README.md);
   - site único (Codigo/build-unificado.mjs, deploy único na Vercel): todas as telas no mesmo
     endereço, em /inicio/, /agenda/..., e as APIs em /srv/<api>/, repassadas ao Render;
   - um projeto por tela: acessamob-<tela>.vercel.app e APIs em acessamob-<api>-api.onrender.com.
   As variáveis VITE_URL_* e VITE_API_URL, se definidas, têm prioridade. */
const env = import.meta.env;

export const LOCAL = ['localhost', '127.0.0.1'].includes(window.location.hostname);
export const SITE_UNICO = env.VITE_SITE_UNICO === '1';

/* porta local, nome do projeto separado e caminho no site único */
function tela(porta, nome, pasta, caminho = '/') {
  if (SITE_UNICO) return '/' + pasta + caminho;
  return LOCAL ? 'http://localhost:' + porta + caminho : 'https://acessamob-' + nome + '.vercel.app' + caminho;
}

export const TELAS = {
  boasVindas: env.VITE_URL_BOAS_VINDAS || tela(5180, 'boas-vindas', 'boas-vindas'),
  inicio: env.VITE_URL_HOMEPAGE || tela(5173, 'inicio', 'inicio'),
  agenda: env.VITE_URL_AGENDA || tela(5174, 'agenda', 'agenda'),
  medicamentos: env.VITE_URL_MEDICAMENTOS || tela(5177, 'medicamentos', 'medicamentos'),
  cadastroMedicamentos: env.VITE_URL_CADASTRO_MEDICAMENTOS || tela(5175, 'cadastro', 'cadastro-medicamentos'),
  tarefas: env.VITE_URL_TAREFAS || tela(5176, 'tarefas', 'tarefas'),
  linhaDoTempo: env.VITE_URL_LINHA_DO_TEMPO || tela(5179, 'perfil', 'idoso', '/linha-do-tempo'),
  cuidadores: env.VITE_URL_CUIDADORES || tela(5178, 'cuidadores', 'cuidadores'),
  perfis: env.VITE_URL_PERFIS || tela(5179, 'perfil', 'idoso', '/perfil'),
};

/* endereço base da API de cada tela; localmente fica vazio ou no localhost, como antes */
export function urlApi(nome, local = '') {
  if (env.VITE_API_URL) return env.VITE_API_URL;
  if (SITE_UNICO) return '/srv/' + nome;
  return LOCAL ? local : 'https://acessamob-' + nome + '-api.onrender.com';
}
