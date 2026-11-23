/* Preferências de acessibilidade (letra maior e alto contraste) e o perfil escolhido nas
   boas-vindas. Antes valiam só na tela de boas-vindas e sumiam ao trocar de tela.

   Ficam num cookie (que o navegador compartilha entre as portas do localhost e no site único)
   e também no localStorage, como reserva. São aplicadas no <html> assim que o módulo é
   importado, antes do React desenhar a tela, para não piscar. */
import { useEffect, useState } from 'react';

const CHAVE = 'acessamob_prefs';
const PADRAO = { fonteMaior: false, altoContraste: false, perfil: null, nome: '' };
const EVENTO = 'acessamob:prefs';

function lerCookie() {
  const par = document.cookie.split('; ').find((c) => c.startsWith(CHAVE + '='));
  if (!par) return null;
  try {
    return JSON.parse(decodeURIComponent(par.slice(CHAVE.length + 1)));
  } catch {
    return null;
  }
}

export function lerPreferencias() {
  let salvo = lerCookie();
  if (!salvo) {
    try {
      salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    } catch {
      salvo = null;
    }
  }
  return { ...PADRAO, ...(salvo || {}) };
}

function aplicar(prefs) {
  const raiz = document.documentElement;
  raiz.classList.toggle('fonte-maior', !!prefs.fonteMaior);
  raiz.classList.toggle('alto-contraste', !!prefs.altoContraste);
}

export function salvarPreferencias(mudanca) {
  const prefs = { ...lerPreferencias(), ...mudanca };
  const texto = JSON.stringify(prefs);
  /* um ano; SameSite=Lax basta, o cookie não sai do próprio site */
  document.cookie = `${CHAVE}=${encodeURIComponent(texto)}; path=/; max-age=31536000; SameSite=Lax`;
  try {
    localStorage.setItem(CHAVE, texto);
  } catch {
    /* modo privado: o cookie já resolve */
  }
  aplicar(prefs);
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: prefs }));
  return prefs;
}

/* hook para telas que mostram ou mudam as preferências */
export function usePreferencias() {
  const [prefs, setPrefs] = useState(lerPreferencias);
  useEffect(() => {
    const ouvir = (e) => setPrefs(e.detail);
    window.addEventListener(EVENTO, ouvir);
    return () => window.removeEventListener(EVENTO, ouvir);
  }, []);
  return [prefs, salvarPreferencias];
}

/* quem está usando: enquanto não há login, o nome cadastrado nas boas-vindas (neste aparelho)
   tem prioridade sobre o usuário padrão das APIs */
export function useUsuario(usuarioApi) {
  const [prefs] = usePreferencias();
  return prefs.nome ? { nome: prefs.nome, tipo: prefs.perfil } : usuarioApi;
}

aplicar(lerPreferencias());
