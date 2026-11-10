import { useCallback, useEffect, useState } from "react";
import { listarIdosos } from "../services/api.js";
import { carregarSelecionado, salvarSelecionado } from "../utils/storage.js";

export function useIdosos() {
  const [idosos, setIdosos] = useState([]);
  const [idosoAtualId, setIdosoAtualIdInterno] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async function () {
    setCarregando(true);
    setErro("");

    try {
      const lista = await listarIdosos();
      setIdosos(lista);
      setIdosoAtualIdInterno(carregarSelecionado(lista));
    } catch (erroCarregar) {
      setErro(erroCarregar.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(function () {
    carregar();
  }, [carregar]);

  const setIdosoAtualId = useCallback(function (id) {
    setIdosoAtualIdInterno(id);
    salvarSelecionado(id);
  }, []);

  let idosoAtual = idosos.find(function (idoso) {
    return idoso.id === idosoAtualId;
  });

  if (!idosoAtual) {
    idosoAtual = null;
  }

  return {
    idosos: idosos,
    setIdosos: setIdosos,
    idosoAtual: idosoAtual,
    setIdosoAtualId: setIdosoAtualId,
    carregando: carregando,
    erro: erro,
    recarregar: carregar
  };
}
