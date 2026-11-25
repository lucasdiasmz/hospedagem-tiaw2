/* Chamadas à API de medicamentos (Codigo/cadastro-medicamentos/server) */
import { urlApi } from '@ds/navegacao.js';

/* local: http://localhost:3003; publicado: a API no Render (src/navegacao.js) */
const URL_API = urlApi('cadastro', 'http://localhost:3003');

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

export function listarMedicamentos() {
  return chamar('/medicamentos');
}

export function criarMedicamento(med) {
  return chamar('/medicamentos', { method: 'POST', body: JSON.stringify(med) });
}

export function definirAtivo(id, ativo) {
  return chamar('/medicamentos/' + id, { method: 'PATCH', body: JSON.stringify({ ativo }) });
}

export function editarMedicamento(id, med) {
  return chamar('/medicamentos/' + id, { method: 'PUT', body: JSON.stringify(med) });
}
