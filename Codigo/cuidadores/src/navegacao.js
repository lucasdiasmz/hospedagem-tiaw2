/* Endereços das telas do AcessaMob.
   Cada módulo roda no seu próprio servidor do Vite; a tabela de portas está em Codigo/README.md.
   Este arquivo é igual em todos os módulos: ao mudar aqui, mude nos outros também.
   Fora do ambiente local, defina as variáveis VITE_URL_* no .env de cada módulo. */
const env = import.meta.env;

export const TELAS = {
  boasVindas: env.VITE_URL_BOAS_VINDAS || 'http://localhost:5180/',
  inicio: env.VITE_URL_HOMEPAGE || 'http://localhost:5173/',
  agenda: env.VITE_URL_AGENDA || 'http://localhost:5174/',
  medicamentos: env.VITE_URL_MEDICAMENTOS || 'http://localhost:5177/',
  cadastroMedicamentos: env.VITE_URL_CADASTRO_MEDICAMENTOS || 'http://localhost:5175/',
  tarefas: env.VITE_URL_TAREFAS || 'http://localhost:5176/',
  linhaDoTempo: env.VITE_URL_LINHA_DO_TEMPO || 'http://localhost:5179/linha-do-tempo',
  cuidadores: env.VITE_URL_CUIDADORES || 'http://localhost:5178/',
  perfis: env.VITE_URL_PERFIS || 'http://localhost:5179/perfil',
};
