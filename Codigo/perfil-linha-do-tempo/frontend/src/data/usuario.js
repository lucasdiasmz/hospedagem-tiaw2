import { NOMES_PERFIL } from "@ds/permissoes.js";
import { lerPreferencias } from "@ds/preferencias.js";

/* quem está usando: o nome e o perfil informados nas boas-vindas */
export function getUsuario() {
  const prefs = lerPreferencias();
  return {
    nome: prefs.nome || "Não informado",
    papel: NOMES_PERFIL[prefs.perfil] || "Perfil não informado"
  };
}
