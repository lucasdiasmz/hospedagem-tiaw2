export const TIPOS = [
  "Dor/Sintoma",
  "Humor",
  "Alimentação",
  "Medicação",
  "Sono",
  "Mobilidade/Queda",
  "Higiene",
  "Outro"
];

export const NIVEIS = ["Normal", "Atencao", "Urgente"];

export const PAPEIS = ["idoso", "cuidador", "familiar"];

export function precisaDeAtencao(nivel) {
  if (nivel === "Atencao" || nivel === "Urgente") {
    return true;
  } else {
    return false;
  }
}
