import { ErroHttp, validarData, validarOpcao, validarTexto, validarTextoOpcional } from '../validacao.js';

/* apoio para andar → nível usado no perfil do idoso */
const NIVEL = {
  nenhuma: 'Independente', andador: 'Parcial', muletas: 'Parcial', 'cadeira-manual': 'Parcial', 'cadeira-motorizada': 'Parcial',
};
const MOBILIDADES = Object.keys(NIVEL);

function validarNascimento(valor) {
  const data = validarData(valor);
  if (data > new Date().toISOString().slice(0, 10) || data < '1900-01-01') throw new ErroHttp(400, 'Confira a data de nascimento');
  return data;
}

/* dados mínimos para cadastrar um idoso; o resto é preenchido na tela de perfil */
export function regrasIdoso() {
  return {
    nome: { validar: (v) => validarTexto(v, 'Nome do idoso', 80) },
    dataNascimento: { validar: validarNascimento },
    mobilidade: { validar: (v) => validarOpcao(v, MOBILIDADES, 'Mobilidade'), padrao: 'nenhuma' },
    telefone: { validar: (v) => validarTextoOpcional(v, 'Telefone', 20), padrao: '' },
  };
}

export function criarIdoso(repo, cliente, dados) {
  return repo.inserir('idosos', {
    clienteId: cliente.id,
    nome: dados.nome,
    apelido: dados.nome.split(' ')[0],
    dataNascimento: dados.dataNascimento,
    telefone: dados.telefone,
    endereco: '',
    planoSaude: '',
    mobilidade: { tipo: dados.mobilidade, nivel: NIVEL[dados.mobilidade], descricao: '', equipamentos: [], precisaAjudaPara: [] },
    condicoes: [],
    alergias: [],
    contatos: [],
    sobre: '',
    observacoes: '',
  });
}
