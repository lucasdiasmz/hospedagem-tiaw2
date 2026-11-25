/* Chamadas à API de tarefas da rede de apoio (Codigo/tarefas/server) */
import { urlApi } from '@ds/navegacao.js';
import { pedir } from '@ds/sessao.js';

/* local: o Vite repassa para http://localhost:3004; publicado: a API no Render (navegacao.js) */
const URL_API = urlApi('tarefas');

async function chamar(caminho, opcoes) {
  let resposta;
  try {
    resposta = await pedir(URL_API + caminho, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
    });
  } catch (e) {
    throw new Error('Sem conexão com o servidor. Confira a internet e tente de novo.');
  }
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(corpo.erro || 'O servidor não respondeu como esperado.');
  return corpo;
}

export function listarTarefas() {
  return chamar('/tarefas-rede');
}

export function criarTarefa(tarefa) {
  return chamar('/tarefas-rede', { method: 'POST', body: JSON.stringify(tarefa) });
}

export function mudarStatus(id, status) {
  return chamar('/tarefas-rede/' + id, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export function marcarComprados(id, itensComprados) {
  return chamar('/tarefas-rede/' + id, { method: 'PATCH', body: JSON.stringify({ itensComprados }) });
}

/* { eu, idosos: [{ id, nome, apelido, membros }] } */
export function listarIdosos() {
  return chamar('/idosos');
}
