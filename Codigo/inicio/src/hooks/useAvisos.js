import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';

const CHAVE_DISPENSADOS = 'acessamob_avisos_dispensados';
/* de quanto em quanto tempo a tela pergunta se há avisos novos */
const INTERVALO = 30000;

function lerDispensados() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_DISPENSADOS) || '[]');
  } catch {
    return [];
  }
}

/* Pedidos de ajuda e solicitações de atendimento de quem está logado.
   Os avisos só informativos (respostas que já chegaram) podem ser dispensados neste aparelho. */
export function useAvisos() {
  const [avisos, setAvisos] = useState({ chamados: [], solicitacoes: [] });
  const [dispensados, setDispensados] = useState(lerDispensados);

  const carregar = useCallback(async () => {
    try {
      setAvisos(await api('/avisos'));
    } catch {
      /* sem avisos não impede o resto da tela; tenta de novo no próximo ciclo */
    }
  }, []);

  useEffect(() => {
    carregar();
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') carregar();
    }, INTERVALO);
    const aoVoltar = () => document.visibilityState === 'visible' && carregar();
    document.addEventListener('visibilitychange', aoVoltar);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', aoVoltar);
    };
  }, [carregar]);

  async function responderChamado(chamado, acao) {
    await api(`/idosos/${chamado.idosoId}/chamados/${chamado.id}`, { metodo: 'PATCH', corpo: { acao } });
    await carregar();
  }

  async function responderSolicitacao(solicitacao, aceitar) {
    await api(`/solicitacoes/${solicitacao.id}/resposta`, { metodo: 'POST', corpo: { aceitar } });
    await carregar();
  }

  function dispensar(id) {
    const lista = [...dispensados, id].slice(-100);
    setDispensados(lista);
    try {
      localStorage.setItem(CHAVE_DISPENSADOS, JSON.stringify(lista));
    } catch {
      /* sem armazenamento, o aviso some só até recarregar */
    }
  }

  const visivel = (id) => !dispensados.includes(id);
  return {
    chamados: avisos.chamados.filter((c) => (c.status !== 'atendido' || c.meu) && visivel(c.id)),
    solicitacoes: avisos.solicitacoes.filter((s) => (s.recebida ? s.status === 'pendente' : true) && visivel(s.id)),
    carregar, responderChamado, responderSolicitacao, dispensar,
  };
}
