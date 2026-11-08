/* Chamadas à API de tarefas da rede de apoio (Codigo/api-tarefas-rede) */
const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function chamar(caminho, opcoes) {
  let resposta;
  try {
    resposta = await fetch(URL_API + caminho, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
    });
  } catch (e) {
    throw new Error('Não foi possível falar com a API. Ela está ligada?');
  }
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(corpo.erro || 'Erro ao falar com a API.');
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
