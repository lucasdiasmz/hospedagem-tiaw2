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

/* mesma chave da tela de perfil: a pessoa escolhida numa tela vale nas outras */
const CHAVE_IDOSO = 'acessamob_idoso_selecionado';

function idosoSalvo() {
  try {
    return localStorage.getItem(CHAVE_IDOSO);
  } catch {
    return null;
  }
}

/* Estado da linha do tempo de hoje, vindo do backend (MongoDB): usuário, idoso, itens e anotações */
export function useCuidadosDoDia() {
  const [usuario, setUsuario] = useState(null);
  const [idosos, setIdosos] = useState([]);
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

  /* carrega o usuário e as pessoas que ele acompanha; mostra a escolhida antes (ou a primeira) */
  const carregarTudo = useCallback(async () => {
    try {
      const [eu, lista] = await Promise.all([api('/usuarios/eu'), api('/idosos')]);
      setUsuario(eu);
      setIdosos(lista);
      const escolhido = lista.find((i) => i.id === idosoSalvo()) || lista[0] || null;
      setIdoso(escolhido);
      if (escolhido) await carregarDia(escolhido.id);
      setErro(null);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [carregarDia]);

  useEffect(() => {
    carregarTudo();
  }, [carregarTudo]);

  /* troca a pessoa acompanhada (quem cuida de mais de uma) */
  async function escolherIdoso(id) {
    const novo = idosos.find((i) => i.id === id);
    if (!novo || novo.id === idoso?.id) return;
    try {
      localStorage.setItem(CHAVE_IDOSO, id);
    } catch {
      /* sem armazenamento, a escolha vale só agora */
    }
    setIdoso(novo);
    setCarregando(true);
    try {
      await carregarDia(id);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

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

  async function chamarAjuda(mensagem) {
    return api(`/idosos/${idoso.id}/chamados`, { metodo: 'POST', corpo: { mensagem } });
  }

  return {
    usuario, idoso, idosos, carregando, erro,
    escolherIdoso, recarregar: carregarTudo,
    linhaDoTempo, proximo, medAtual,
    definir, adicionarNota, removerNota, chamarAjuda,
  };
}
