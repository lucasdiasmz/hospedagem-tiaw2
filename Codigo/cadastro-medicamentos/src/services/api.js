/* Chamadas à API de medicamentos (Codigo/api-medicamentos) */
const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3003';

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

export function listarMedicamentos() {
  return chamar('/medicamentos');
}

export function criarMedicamento(med) {
  return chamar('/medicamentos', { method: 'POST', body: JSON.stringify(med) });
}

export function definirAtivo(id, ativo) {
  return chamar('/medicamentos/' + id, { method: 'PATCH', body: JSON.stringify({ ativo }) });
}
