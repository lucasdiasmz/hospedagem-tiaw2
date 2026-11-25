/* limita tentativas por chave (e-mail, código...) em memória: "max" a cada "janela" ms */
export function criarLimite(max, janela = 15 * 60 * 1000) {
  const usos = new Map();
  return {
    estourou(chave, agora = Date.now()) {
      const atual = usos.get(chave);
      return Boolean(atual && atual.ate > agora && atual.n >= max);
    },
    contar(chave, agora = Date.now()) {
      if (usos.size > 5000) {
        for (const [k, v] of usos) if (v.ate <= agora) usos.delete(k);
      }
      const atual = usos.get(chave);
      if (!atual || atual.ate <= agora) usos.set(chave, { n: 1, ate: agora + janela });
      else atual.n += 1;
    },
    zerar(chave) {
      usos.delete(chave);
    },
  };
}
