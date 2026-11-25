import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { compararHora, diaDeHoje, horaAgora } from '../utils/hora.js';

/* tipos do backend → tipos usados nos ícones da tela */
const TIPO_NA_TELA = { medicamento: 'med', consulta: 'consulta', tarefa: 'tarefa', agendamento: 'visita' };

/* item da linha do tempo da API → item da tela ("id" é a chave única do item no dia) */
function paraTela(item) {
  return {
    id: item.chave,
    itemId: item.itemId,
    horarioPrevisto: item.horarioPrevisto,
    tipo: TIPO_NA_TELA[item.tipo],
    hora: item.horario,
    titulo: item.titulo,
    detalhe: item.detalhe,
    status: item.status,
  };
}

/* Estado da linha do tempo de hoje, vindo do backend (MongoDB): usuário, idoso, itens e anotações */
export function useCuidadosDoDia() {
  const [usuario, setUsuario] = useState(null);
  const [idoso, setIdoso] = useState(null);
  const [itens, setItens] = useState([]);
  const [notas, setNotas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const data = diaDeHoje();

  const carregarDia = useCallback(async (idosoId) => {
    const dia = await api(`/idosos/${idosoId}/dias/${data}`);
    setItens(dia.itens.map(paraTela));
    setNotas(dia.anotacoes);
  }, [data]);

  useEffect(() => {
    (async () => {
      try {
        const [eu, idosos] = await Promise.all([api('/usuarios/eu'), api('/idosos')]);
        setUsuario(eu);
        /* por enquanto a tela mostra o primeiro idoso que o usuário acompanha */
        if (idosos[0]) {
          setIdoso(idosos[0]);
          await carregarDia(idosos[0].id);
        }
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    })();
  }, [carregarDia]);

  const ordenados = [...itens].sort(compararHora);
  const pendentes = ordenados.filter((i) => !i.status);
  const medAtual = pendentes.find((i) => i.tipo === 'med') || null;
  /* remédio atrasado vem antes de qualquer outro cuidado atrasado */
  const medAtrasado = medAtual && medAtual.hora <= horaAgora() ? medAtual : null;
  const proximo = medAtrasado || pendentes[0] || null;

  /* itens e anotações juntos, em ordem de horário */
  const linhaDoTempo = [
    ...ordenados,
    ...notas.map((n) => ({ ...n, tipo: 'nota' })),
  ].sort(compararHora);

  const base = idoso && `/idosos/${idoso.id}/dias/${data}`;

  /* mudanca: { status: 'feito' | 'recusou' | null } e/ou { hora: 'HH:MM' } (adiar) */
  async function definir(id, mudanca) {
    const item = itens.find((i) => i.id === id);
    if (!item) return;
    const corpo = { horarioPrevisto: item.horarioPrevisto };
    if (mudanca.status !== undefined) corpo.status = mudanca.status;
    if (mudanca.hora !== undefined) corpo.horarioAdiado = mudanca.hora;
    const atualizado = await api(`${base}/itens/${item.itemId}`, { metodo: 'PATCH', corpo });
    setItens((atuais) => atuais.map((i) => (i.id === id ? paraTela(atualizado) : i)));
  }

  async function adicionarNota({ hora, texto }) {
    const nota = await api(`${base}/anotacoes`, { metodo: 'POST', corpo: { hora, texto } });
    setNotas((atuais) => [...atuais, nota]);
    return nota;
  }

  async function removerNota(id) {
    await api(`${base}/anotacoes/${id}`, { metodo: 'DELETE' });
    setNotas((atuais) => atuais.filter((n) => n.id !== id));
  }

  async function chamarAjuda() {
    return api(`/idosos/${idoso.id}/chamados`, { metodo: 'POST', corpo: {} });
  }

  return {
    usuario, idoso, carregando, erro,
    linhaDoTempo, proximo, medAtual,
    definir, adicionarNota, removerNota, chamarAjuda,
  };
}
