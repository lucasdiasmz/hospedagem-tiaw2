/* Sessão no navegador. O login fica num cookie HttpOnly, que o JavaScript não lê: aqui só ficam o nome e
   o perfil (preferencias.js), para desenhar o menu. Quem decide o que cada um pode ver são as APIs.
   O cookie vale para um endereço só, então o login precisa do site único (ou do localhost). */
import { TELAS, urlApi } from './navegacao.js';
import { salvarPreferencias } from './preferencias.js';

const URL_AUTH = urlApi('inicio') + '/api/auth';

/* guarda quem entrou; as preferências de acessibilidade continuam as mesmas */
export function guardarUsuario(usuario) {
  salvarPreferencias({
    perfil: usuario.papel, nome: usuario.nome, usuarioId: usuario.id, telefone: undefined, mobilidade: undefined, cuidador: undefined,
  });
}

function esquecerUsuario() {
  guardarUsuario({ papel: null, nome: '', id: undefined });
}

/* a primeira ida vale: o Shell também manda para a entrada quando o perfil some */
let saindo = false;
export function irParaEntrada(motivo = '') {
  if (saindo) return;
  saindo = true;
  window.location.replace(TELAS.boasVindas + motivo);
}

/* fetch das telas: sem sessão (401), volta para as boas-vindas. A promessa fica pendente de propósito,
   para a tela não piscar um erro enquanto a página troca. */
export async function pedir(url, opcoes) {
  const resposta = await fetch(url, opcoes);
  if (resposta.status !== 401) return resposta;
  irParaEntrada('?sessao=fim');
  esquecerUsuario();
  return new Promise(() => {});
}

async function chamar(caminho, corpo) {
  let resposta;
  try {
    resposta = await fetch(URL_AUTH + caminho, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
  } catch {
    throw new Error('Sem conexão com o servidor. Confira a internet e tente de novo.');
  }
  if (resposta.status === 204) return null;
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.erro || 'O servidor não respondeu como esperado.');
  return dados;
}

export async function entrar(email, senha) {
  guardarUsuario(await chamar('/entrar', { email, senha }));
}

export async function cadastrar(dados) {
  guardarUsuario(await chamar('/cadastrar', dados));
}

export async function sair() {
  await chamar('/sair', {});
  irParaEntrada();
  esquecerUsuario();
}
