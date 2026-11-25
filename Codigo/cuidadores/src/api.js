/* Chamadas à API dos cuidadores (servidor.js). Local: o Vite repassa /api; publicado: Render. */
import { urlApi } from '@ds/navegacao.js';
import { pedir } from '@ds/sessao.js';

const URL_API = urlApi('cuidadores') + '/api';

async function chamar(caminho, { metodo = 'GET', corpo, signal } = {}) {
    let resposta;
    try {
        resposta = await pedir(URL_API + caminho, {
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

/* Completa os campos que faltarem. Assim a tela não quebra se a API publicada ainda for uma
   versão antiga (que devolvia só id e nome na lista e não calculava a média no perfil). */
function mediaDe(avaliacoes) {
    if (!avaliacoes.length) return null;
    return Math.round((avaliacoes.reduce((t, a) => t + a.nota, 0) / avaliacoes.length) * 10) / 10;
}

function completar(c) {
    const avaliacoes = Array.isArray(c.avaliacoes) ? c.avaliacoes : [];
    const disponibilidade = c.disponibilidade && typeof c.disponibilidade === 'object' ? c.disponibilidade : {};
    return {
        ...c,
        nome: c.nome || 'Cuidador(a)',
        servicos: c.servicos || [],
        especialidades: c.especialidades || [],
        fazNoAtendimento: c.fazNoAtendimento || [],
        naoFaz: c.naoFaz || [],
        diferenciais: c.diferenciais || [],
        qualificacoes: c.qualificacoes || [],
        referencias: c.referencias || [],
        avaliacoes,
        bairro: c.bairro ?? c.localizacao?.bairro ?? '',
        cidade: c.cidade ?? c.localizacao?.cidade ?? '',
        localizacao: { bairro: c.localizacao?.bairro || c.bairro || '', cidade: c.localizacao?.cidade || c.cidade || '' },
        dias: c.dias || disponibilidade.dias || [],
        disponibilidade: { descricao: '', dias: [], inicio: '', fim: '', ...disponibilidade },
        resumo: c.resumo ?? (c.sobre || '').split(/(?<=[.!?])\s/)[0],
        valorHora: Number.isFinite(c.valorHora) ? c.valorHora : null,
        media: c.media !== undefined ? c.media : mediaDe(avaliacoes),
        totalAvaliacoes: c.totalAvaliacoes ?? avaliacoes.length,
        registroProfissional: c.registroProfissional ?? (c.qualificacoes || []).some(q => /\b(COREN|CRM|CREFITO|CRF|CRESS|CRN)\b/i.test(q))
    };
}

export const listarCuidadores = (signal) => chamar('/cuidadores', { signal }).then(lista => lista.map(completar));
export const buscarPerfil = (id, signal) => chamar('/cuidadores/' + encodeURIComponent(id), { signal }).then(completar);
export const listarIdosos = () => chamar('/idosos');
export const avaliar = (id, avaliacao) => chamar('/cuidadores/' + encodeURIComponent(id) + '/avaliacoes', { metodo: 'POST', corpo: avaliacao }).then(completar);
export const solicitar = (pedido) => chamar('/solicitacoes', { metodo: 'POST', corpo: pedido });
