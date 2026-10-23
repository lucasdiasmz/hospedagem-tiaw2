import { useEffect, useState } from 'react';

function ler(chave, padrao) {
  try {
    const v = JSON.parse(localStorage.getItem(chave));
    return v == null ? padrao : v;
  } catch (e) {
    return padrao;
  }
}

/* useState que também salva o valor no localStorage */
export function useLocalStorage(chave, padrao) {
  const [valor, setValor] = useState(() => ler(chave, padrao));

  useEffect(() => {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) {}
  }, [chave, valor]);

  return [valor, setValor];
}
