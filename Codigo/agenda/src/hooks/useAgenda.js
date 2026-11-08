import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { diasDaSemana, hoje } from '../utils/datas.js';

/* quantos compromissos distintos mostrar em "Próximos" */
const LIMITE_PROXIMOS = 4;

/* Estado da agenda, vindo do backend (MongoDB): usuário, idosos, catálogos, os meses que a
   visão atual precisa (uma semana pode cruzar dois meses) e os próximos compromissos. */
export function useAgenda() {
  const [usuario, setUsuario] = useState(null);
  const [idosos, setIdosos] = useState([]);
  const [idosoId, setIdosoId] = useState(null);
  const [catalogos, setCatalogos] = useState(null);
  const [visao, setVisao] = useState('semana');
  const [selecionado, setSelecionado] = useState(hoje);
  /* agenda de cada mês já carregado: { "AAAA-MM": { eventos, resumo } } do idoso atual */
  const [meses, setMeses] = useState({});
  const [proximos, setProximos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const mes = selecionado.slice(0, 7);
  const semana = diasDaSemana(selecionado);
  const mesesVisiveis = visao === 'mes'
    ? [mes]
    : [...new Set([semana[0].slice(0, 7), semana[6].slice(0, 7)])];
  const chaveMeses = mesesVisiveis.join(',');

  /* usuário, idosos e catálogos: uma vez só */
  useEffect(() => {
    (async () => {
      try {
        const [eu, lista, cat] = await Promise.all([api('/usuarios/eu'), api('/idosos'), api('/catalogos')]);
        setUsuario(eu);
        setIdosos(lista);
        setCatalogos(cat);
        if (lista[0]) setIdosoId(lista[0].id);
        else setCarregando(false);
      } catch (e) {
        setErro(e.message);
        setCarregando(false);
      }
    })();
  }, []);

  /* busca os meses pedidos (todos, se "forcar") e os próximos compromissos */
  const carregar = useCallback(async (lista, { forcar = false } = {}) => {
    if (!idosoId) return;
    try {
      const faltam = forcar ? lista : lista.filter((m) => !meses[m]);
      const [dados, prox] = await Promise.all([
        Promise.all(faltam.map((m) => api(`/idosos/${idosoId}/agenda/${m}`))),
        forcar || !Object.keys(meses).length
          ? api(`/idosos/${idosoId}/agenda/proximos?de=${hoje()}&limite=20`)
          : null,
      ]);
      if (dados.length) {
        setMeses((atual) => {
          const novo = forcar ? {} : { ...atual };
          dados.forEach((d) => { if (d.idosoId === idosoId) novo[d.mes] = d; });
          return novo;
        });
      }
      if (prox) {
        /* um evento que se repete aparece uma vez só (a próxima ocorrência) */
        const vistos = new Set();
        setProximos(prox.filter((e) => !vistos.has(e.eventoId) && vistos.add(e.eventoId)).slice(0, LIMITE_PROXIMOS));
      }
      setErro(null);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [idosoId, meses]);

  useEffect(() => {
    carregar(chaveMeses.split(','));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idosoId, chaveMeses]);

  const recarregar = () => carregar(mesesVisiveis, { forcar: true });

  /* ocorrências de um dia (só dos meses já carregados) */
  function eventosDoDia(data) {
    return meses[data.slice(0, 7)]?.eventos.filter((e) => e.data === data) || [];
  }

  const base = idosoId && `/idosos/${idosoId}/eventos`;

  async function criar(evento) {
    const criado = await api(base, { metodo: 'POST', corpo: evento });
    await recarregar();
    return criado;
  }

  async function alterarStatus(eventoId, status) {
    await api(`${base}/${eventoId}`, { metodo: 'PATCH', corpo: { status } });
    await recarregar();
  }

  async function excluir(eventoId) {
    await api(`${base}/${eventoId}`, { metodo: 'DELETE' });
    await recarregar();
  }

  function trocarIdoso(id) {
    setMeses({});
    setProximos([]);
    setIdosoId(id);
  }

  return {
    usuario, idosos, idosoId, catalogos, carregando, erro,
    visao, mudarVisao: setVisao,
    selecionado, mes, semana,
    resumo: meses[mes]?.resumo || null,
    carregado: mesesVisiveis.every((m) => meses[m]),
    eventosDoDia, proximos,
    selecionar: setSelecionado, trocarIdoso,
    criar, alterarStatus, excluir,
  };
}
