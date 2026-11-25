export const FREQUENCIAS = [
  { valor: 1, rotulo: '1 vez ao dia' },
  { valor: 2, rotulo: '2 vezes ao dia' },
  { valor: 3, rotulo: '3 vezes ao dia' },
  { valor: 4, rotulo: '4 vezes ao dia' },
];

/* horários sugeridos para cada frequência, que o usuário pode ajustar */
const HORARIOS_PADRAO = {
  1: ['08:00'],
  2: ['08:00', '20:00'],
  3: ['08:00', '14:00', '20:00'],
  4: ['06:00', '12:00', '18:00', '22:00'],
};

export function horariosPadrao(frequencia) {
  return HORARIOS_PADRAO[frequencia].slice();
}

/* devolve um objeto { campo: mensagem } com os erros; vazio quando está tudo certo */
export function validar(med) {
  const erros = {};
  if (!med.nome.trim()) erros.nome = 'Informe o nome do medicamento.';
  if (!med.dosagem.trim()) erros.dosagem = 'Informe a dosagem. Ex.: 50 mg.';
  if (med.horarios.some((h) => !h)) erros.horarios = 'Preencha todos os horários.';
  else if (new Set(med.horarios).size !== med.horarios.length) erros.horarios = 'Há horários repetidos.';
  return erros;
}
