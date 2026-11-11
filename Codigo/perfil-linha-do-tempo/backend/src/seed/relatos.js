const maria = { nome: "Maria Silva", papel: "cuidador" };
const ana = { nome: "Ana Souza", papel: "cuidador" };
const carla = { nome: "Carla Ribeiro", papel: "familiar" };
const antonio = { nome: "Seu Antônio", papel: "idoso" };

const joana = { nome: "Joana Lima", papel: "cuidador" };
const paulo = { nome: "Paulo Campos", papel: "familiar" };
const lurdes = { nome: "Dona Lurdes", papel: "idoso" };

export const USUARIO_LOGADO = "Maria Silva";

export const relatosHoje = [
  { idoso: 0, minutosAtras: 25, tipo: "Dor/Sintoma", nivel: "Atencao", descricao: "Dor forte no joelho direito depois de levantar da poltrona.", registradoPor: antonio },
  { idoso: 0, minutosAtras: 60, tipo: "Mobilidade/Queda", nivel: "Urgente", descricao: "Quase caiu ao levantar da poltrona, conseguiu se apoiar no andador.", registradoPor: ana },
  { idoso: 0, minutosAtras: 110, tipo: "Humor", nivel: "Normal", descricao: "Mais disposto hoje, conversou bastante sobre futebol.", registradoPor: carla },
  { idoso: 0, minutosAtras: 170, tipo: "Medicação", nivel: "Atencao", descricao: "Não quis tomar a Metformina, disse que estava enjoado.", registradoPor: ana },
  { idoso: 0, minutosAtras: 230, tipo: "Alimentação", nivel: "Normal", descricao: "Comeu o prato todo.", registradoPor: maria },
  { idoso: 0, minutosAtras: 300, tipo: "Higiene", nivel: "Normal", descricao: "Banho assistido sem intercorrências.", registradoPor: maria },
  { idoso: 0, minutosAtras: 420, tipo: "Alimentação", nivel: "Atencao", descricao: "Tomou só metade do café.", registradoPor: carla },
  { idoso: 0, minutosAtras: 540, tipo: "Sono", nivel: "Atencao", descricao: "Acordou várias vezes durante a noite com dor no joelho.", registradoPor: antonio },

  { idoso: 1, minutosAtras: 30, tipo: "Humor", nivel: "Atencao", descricao: "Disse que está com saudade dos netos e chorou um pouco.", registradoPor: lurdes },
  { idoso: 1, minutosAtras: 95, tipo: "Alimentação", nivel: "Atencao", descricao: "Comeu só metade da refeição.", registradoPor: joana },
  { idoso: 1, minutosAtras: 180, tipo: "Dor/Sintoma", nivel: "Urgente", descricao: "Dor de cabeça forte há mais de duas horas.", registradoPor: lurdes },
  { idoso: 1, minutosAtras: 260, tipo: "Outro", nivel: "Normal", descricao: "Recebeu ligação do filho e ficou animada.", registradoPor: paulo },
  { idoso: 1, minutosAtras: 400, tipo: "Sono", nivel: "Normal", descricao: "Dormiu a noite toda.", registradoPor: joana }
];

export const relatosAnteriores = [
  { idoso: 0, diasAtras: 1, horario: "07:30", tipo: "Sono", nivel: "Atencao", descricao: "Dormiu mal e acordou muito cedo.", registradoPor: antonio },
  { idoso: 0, diasAtras: 1, horario: "09:15", tipo: "Alimentação", nivel: "Normal", descricao: "Café da manhã completo.", registradoPor: maria },
  { idoso: 0, diasAtras: 1, horario: "10:40", tipo: "Dor/Sintoma", nivel: "Atencao", descricao: "Joelho inchado depois da fisioterapia.", registradoPor: ana },
  { idoso: 0, diasAtras: 1, horario: "14:20", tipo: "Higiene", nivel: "Atencao", descricao: "Recusou o banho, pediu para tomar no dia seguinte.", registradoPor: ana },
  { idoso: 0, diasAtras: 1, horario: "16:00", tipo: "Humor", nivel: "Normal", descricao: "Jogou dominó com o vizinho.", registradoPor: carla },
  { idoso: 0, diasAtras: 1, horario: "21:00", tipo: "Medicação", nivel: "Normal", descricao: "Sinvastatina tomada no horário.", registradoPor: maria },
  { idoso: 0, diasAtras: 3, horario: "08:10", tipo: "Humor", nivel: "Atencao", descricao: "Ficou quieto e desanimado a manhã toda.", registradoPor: maria },
  { idoso: 0, diasAtras: 3, horario: "15:00", tipo: "Higiene", nivel: "Atencao", descricao: "Recusou o banho.", registradoPor: ana },
  { idoso: 0, diasAtras: 3, horario: "20:45", tipo: "Sono", nivel: "Normal", descricao: "Dormiu cedo e bem.", registradoPor: carla },
  { idoso: 0, diasAtras: 5, horario: "11:00", tipo: "Mobilidade/Queda", nivel: "Urgente", descricao: "Escorregou no banheiro, sem machucados aparentes.", registradoPor: ana },
  { idoso: 0, diasAtras: 5, horario: "13:00", tipo: "Alimentação", nivel: "Normal", descricao: "Almoçou bem.", registradoPor: maria },
  { idoso: 0, diasAtras: 9, horario: "10:00", tipo: "Higiene", nivel: "Atencao", descricao: "Recusou o banho.", registradoPor: ana },

  { idoso: 1, diasAtras: 1, horario: "08:30", tipo: "Alimentação", nivel: "Atencao", descricao: "Recusou parte do café da manhã.", registradoPor: maria },
  { idoso: 1, diasAtras: 1, horario: "12:40", tipo: "Mobilidade/Queda", nivel: "Atencao", descricao: "Sentiu tontura na transferência para a cadeira.", registradoPor: joana },
  { idoso: 1, diasAtras: 1, horario: "18:50", tipo: "Humor", nivel: "Atencao", descricao: "Ficou triste no fim da tarde, sentindo falta da família.", registradoPor: lurdes },
  { idoso: 1, diasAtras: 2, horario: "09:00", tipo: "Alimentação", nivel: "Atencao", descricao: "Comeu pouco no café.", registradoPor: joana },
  { idoso: 1, diasAtras: 2, horario: "16:30", tipo: "Outro", nivel: "Normal", descricao: "Fez crochê na varanda.", registradoPor: paulo },
  { idoso: 1, diasAtras: 4, horario: "10:20", tipo: "Medicação", nivel: "Normal", descricao: "Cálcio + Vitamina D tomado no horário.", registradoPor: maria },
  { idoso: 1, diasAtras: 4, horario: "21:00", tipo: "Sono", nivel: "Atencao", descricao: "Demorou para pegar no sono.", registradoPor: joana }
];
