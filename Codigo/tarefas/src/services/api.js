/* Chamadas à API de tarefas da rede de apoio (Codigo/tarefas/server) */
import { urlApi } from '@ds/navegacao.js';

/* local: http://localhost:3004; publicado: a API no Render (src/navegacao.js) */
const URL_API = urlApi('tarefas', 'http://localhost:3004');

async function chamar(caminho, opcoes) {
  let resposta;
  try {
    resposta = await fetch(URL_API + caminho, {
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
