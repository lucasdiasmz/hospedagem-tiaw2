/* Chamadas à API dos cuidadores (servidor.js). Local: o Vite repassa /api; publicado: Render. */
import { urlApi } from '@ds/navegacao.js';

const URL_API = urlApi('cuidadores') + '/api';

async function chamar(caminho, { metodo = 'GET', corpo, signal } = {}) {
    let resposta;
    try {
        resposta = await fetch(URL_API + caminho, {
            method: metodo,
            signal,
            headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
            body: corpo ? JSON.stringify(corpo) : undefined
        });
    } catch (falha) {
        if (falha.name === 'AbortError') throw falha;
        throw new Error('Sem conexão com o servidor.');
    }
    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok) {
        const erro = new Error(dados.mensagem || 'Não foi possível carregar os dados.');
        erro.status = resposta.status;
        throw erro;
    }
    return dados;
}

export const listarCuidadores = (signal) => chamar('/cuidadores', { signal });
export const buscarPerfil = (id, signal) => chamar('/cuidadores/' + encodeURIComponent(id), { signal });
export const listarIdosos = () => chamar('/idosos');
export const avaliar = (id, avaliacao) => chamar('/cuidadores/' + encodeURIComponent(id) + '/avaliacoes', { metodo: 'POST', corpo: avaliacao });
export const solicitar = (pedido) => chamar('/solicitacoes', { metodo: 'POST', corpo: pedido });
