export const TIPOS = [
  { id: "Dor/Sintoma", icone: "stethoscope", classe: "cat-dor" },
  { id: "Humor", icone: "smile", classe: "cat-humor" },
  { id: "Alimentação", icone: "utensils", classe: "cat-alimentacao" },
  { id: "Medicação", icone: "pill", classe: "cat-medicacao" },
  { id: "Sono", icone: "moon", classe: "cat-sono" },
  { id: "Mobilidade/Queda", icone: "accessibility", classe: "cat-mobilidade" },
  { id: "Higiene", icone: "droplet", classe: "cat-higiene" },
  { id: "Outro", icone: "message", classe: "cat-outro" }
];

export const NIVEIS = {
  Normal: { label: "Normal", classe: "selo-normal", icone: "check" },
  Atencao: { label: "Atenção", classe: "selo-atencao", icone: "alert" },
  Urgente: { label: "Urgente", classe: "selo-urgente", icone: "alert" }
};

export const PAPEIS = {
  idoso: "Idoso(a)",
  cuidador: "Cuidador(a)",
  familiar: "Familiar"
};

export const PERIODOS = [
  { id: "manha", label: "Manhã", icone: "sunrise", inicio: 0, fim: 12 },
  { id: "tarde", label: "Tarde", icone: "sun", inicio: 12, fim: 18 },
  { id: "noite", label: "Noite", icone: "moon", inicio: 18, fim: 24 }
];

export function getTipo(id) {
  const tipo = TIPOS.find(function (item) {
    return item.id === id;
  });

  if (tipo) {
    return tipo;
  } else {
    return { id: id, icone: "message", classe: "cat-outro" };
  }
}

export function getNivel(id) {
  if (NIVEIS[id]) {
    return NIVEIS[id];
  } else {
    return NIVEIS.Normal;
  }
}

export function getRotuloPapel(papel) {
  if (PAPEIS[papel]) {
    return PAPEIS[papel];
  } else {
    return papel;
  }
}
