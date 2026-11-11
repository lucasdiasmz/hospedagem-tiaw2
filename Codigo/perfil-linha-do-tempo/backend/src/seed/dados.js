export const idososIniciais = [
  {
    nome: "Antônio Ribeiro",
    apelido: "Seu Antônio",
    dataNascimento: "1945-03-12",
    sexo: "Masculino",
    tipoSanguineo: "O+",
    telefone: "(31) 98765-4321",
    endereco: "Rua Pouso Alegre, 210 — Floresta, Belo Horizonte",
    planoSaude: "Unimed BH",
    mobilidade: {
      nivel: "Parcial",
      descricao: "Anda com andador dentro de casa e usa cadeira de rodas em saídas mais longas.",
      equipamentos: ["Andador", "Cadeira de rodas", "Barras de apoio no banheiro"],
      precisaAjudaPara: ["Banho", "Levantar da cama", "Subir escadas"]
    },
    condicoes: ["Hipertensão", "Artrose no joelho direito", "Diabetes tipo 2"],
    alergias: ["Dipirona", "Frutos do mar"],
    medicamentos: [
      { nome: "Losartana", dose: "50 mg", horario: "08:00" },
      { nome: "Metformina", dose: "850 mg", horario: "12:30" },
      { nome: "Sinvastatina", dose: "20 mg", horario: "21:00" }
    ],
    rotina: [
      { horario: "07:30", atividade: "Café da manhã" },
      { horario: "10:00", atividade: "Fisioterapia (seg, qua e sex)" },
      { horario: "12:00", atividade: "Almoço" },
      { horario: "15:00", atividade: "Caminhada assistida no quintal" },
      { horario: "19:00", atividade: "Jantar" }
    ],
    contatos: [
      { nome: "Carla Ribeiro", parentesco: "Filha", telefone: "(31) 99123-4567", principal: true },
      { nome: "Marcos Ribeiro", parentesco: "Filho", telefone: "(31) 99876-5432", principal: false }
    ],
    cuidadores: [
      { nome: "Maria Silva", funcao: "Cuidadora principal", turno: "Manhã e tarde" },
      { nome: "Ana Souza", funcao: "Cuidadora", turno: "Visitas semanais" }
    ],
    sobre: "Aposentado, trabalhou 40 anos como marceneiro. Gosta de ouvir rádio pela manhã, jogar dominó e conversar sobre futebol.",
    observacoes: "Prefere ser chamado de Seu Antônio. Fica mais agitado no fim da tarde, então é bom manter o ambiente calmo."
  },
  {
    nome: "Maria de Lourdes Campos",
    apelido: "Dona Lurdes",
    dataNascimento: "1950-07-28",
    sexo: "Feminino",
    tipoSanguineo: "A+",
    telefone: "(31) 98811-2233",
    endereco: "Rua das Acácias, 45 — Santa Tereza, Belo Horizonte",
    planoSaude: "SUS",
    mobilidade: {
      nivel: "Dependente",
      descricao: "Usa cadeira de rodas o tempo todo e precisa de ajuda em todas as transferências.",
      equipamentos: ["Cadeira de rodas", "Cama hospitalar", "Elevador de transferência"],
      precisaAjudaPara: ["Transferência cama/cadeira", "Banho", "Vestir-se", "Alimentação"]
    },
    condicoes: ["Sequela de AVC (lado esquerdo)", "Osteoporose"],
    alergias: [],
    medicamentos: [
      { nome: "AAS", dose: "100 mg", horario: "08:00" },
      { nome: "Cálcio + Vitamina D", dose: "1 comprimido", horario: "12:00" },
      { nome: "Atorvastatina", dose: "40 mg", horario: "20:00" }
    ],
    rotina: [
      { horario: "08:00", atividade: "Café da manhã e higiene" },
      { horario: "11:00", atividade: "Exercícios com a fisioterapeuta" },
      { horario: "12:30", atividade: "Almoço" },
      { horario: "16:00", atividade: "Banho de sol na varanda" },
      { horario: "19:30", atividade: "Jantar" }
    ],
    contatos: [
      { nome: "Paulo Campos", parentesco: "Filho", telefone: "(31) 99555-1020", principal: true }
    ],
    cuidadores: [
      { nome: "Maria Silva", funcao: "Cuidadora principal", turno: "Manhã" },
      { nome: "Joana Lima", funcao: "Técnica de enfermagem", turno: "Noite" }
    ],
    sobre: "Professora aposentada. Adora novelas, crochê e receber a visita dos netos aos domingos.",
    observacoes: "Comunica-se bem, mas fala devagar. Dê tempo para ela terminar de responder."
  }
];
