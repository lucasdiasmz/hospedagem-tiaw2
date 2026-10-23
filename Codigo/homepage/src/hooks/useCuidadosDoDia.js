import { ITENS_DO_DIA } from '../data/cuidados.js';
import { compararHora, diaDeHoje } from '../utils/hora.js';
import { useLocalStorage } from './useLocalStorage.js';

export const TIPOS = ['med', 'consulta', 'tarefa', 'visita'];

/* Estado da linha do tempo de hoje: itens, anotações e tudo que é calculado a partir deles */
export function useCuidadosDoDia() {
  /* { id: { status: 'tomei' | 'recusou' | null, hora: 'HH:MM' } }, salvo por data */
  const [estado, setEstado] = useLocalStorage('estado-dia-' + diaDeHoje(), {});
  const [notas, setNotas] = useLocalStorage('anotacoes-linha-do-tempo', []);

  const itens = ITENS_DO_DIA.map((item) => {
    const e = estado[item.id] || {};
    return { ...item, hora: e.hora || item.hora, status: e.status || null };
  }).sort(compararHora);

  const pendentes = itens.filter((i) => !i.status);
  const proximo = pendentes[0] || null;
  const medAtual = pendentes.find((i) => i.tipo === 'med') || null;

  /* itens e anotações juntos, em ordem de horário */
  const linhaDoTempo = [
    ...itens,
    ...notas.map((n) => ({ ...n, tipo: 'nota' })),
  ].sort(compararHora);

  const contagem = {};
  TIPOS.forEach((tipo) => {
    const grupo = itens.filter((i) => i.tipo === tipo);
    contagem[tipo] = { feitos: grupo.filter((i) => i.status === 'tomei').length, total: grupo.length };
  });

  function definir(id, mudanca) {
    setEstado((atual) => ({ ...atual, [id]: { ...atual[id], ...mudanca } }));
  }

  function alternar(id) {
    const atual = estado[id] || {};
    definir(id, { status: atual.status === 'tomei' ? null : 'tomei' });
  }

  function adicionarNota(nota) {
    setNotas((atuais) => [...atuais, nota]);
  }

  function removerNota(id) {
    setNotas((atuais) => atuais.filter((n) => n.id !== id));
  }

  return { linhaDoTempo, proximo, medAtual, contagem, definir, alternar, adicionarNota, removerNota };
}
