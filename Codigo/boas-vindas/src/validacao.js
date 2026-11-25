/* máscara simples de telefone brasileiro: (31) 99999-9999 */
export function mascararTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? '(' + d : '';
  if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
}

/* nome e sobrenome, só com letras (aceita acento, hífen, apóstrofo e abreviação) */
export function nomeValido(nome) {
  const partes = nome.trim().split(/\s+/);
  return partes.length >= 2 && partes.every((p) => /^\p{L}[\p{L}\p{M}'’.-]*$/u.test(p));
}

/* DDD sem zero + celular (9 dígitos, começa com 9) ou fixo (8 dígitos, começa de 2 a 5) */
export function telefoneValido(telefone) {
  return /^[1-9]{2}(9\d{8}|[2-5]\d{7})$/.test(telefone.replace(/\D/g, ''));
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function nascimentoValido(data) {
  return /^\d{4}-\d{2}-\d{2}$/.test(data) && data >= '1900-01-01' && data <= new Date().toLocaleDateString('sv-SE');
}

/* passo 2: { campo: mensagem } */
export function errosDosDados(d) {
  const erros = {};
  if (!nomeValido(d.nome)) erros.nome = 'Escreva nome e sobrenome, só com letras.';
  if (d.telefone && !telefoneValido(d.telefone)) erros.telefone = 'Confira o telefone com DDD.';
  if (!emailValido(d.email)) erros.email = 'Confira o e-mail.';
  if (d.senha.length < 8) erros.senha = 'Use pelo menos 8 caracteres.';
  return erros;
}

/* passo 3, conforme o perfil */
export function errosDoPasso3(perfil, p) {
  const erros = {};
  const comCodigo = perfil === 'cliente' ? p.ligacao === 'codigo' : perfil === 'idoso' && p.ligacao === 'codigo';
  if (comCodigo && p.codigo.replace(/[^a-z0-9]/gi, '').length !== 8) erros.codigo = 'O código tem 8 letras e números.';
  if (perfil === 'idoso' && !comCodigo && !nascimentoValido(p.nascimento)) erros.nascimento = 'Confira a data de nascimento.';
  if (perfil === 'cliente' && p.ligacao === 'novo') {
    if (!nomeValido(p.nomeIdoso)) erros.nomeIdoso = 'Escreva nome e sobrenome, só com letras.';
    if (!nascimentoValido(p.nascimento)) erros.nascimento = 'Confira a data de nascimento.';
  }
  if (perfil === 'cuidador') {
    if (!p.experiencia) erros.experiencia = 'Escolha o tempo de experiência.';
    if (!p.servicos.length) erros.servicos = 'Escolha pelo menos um serviço.';
    if (!p.dias.length) erros.dias = 'Escolha pelo menos um dia.';
    if (!p.inicio || !p.fim) erros.horas = 'Preencha os dois horários.';
    else if (p.inicio === p.fim) erros.horas = 'O fim precisa ser diferente do início.';
    if (p.codigo && p.codigo.replace(/[^a-z0-9]/gi, '').length !== 8) erros.codigo = 'O código tem 8 letras e números.';
  }
  if (!p.consentimento) erros.consentimento = 'É preciso aceitar para criar a conta.';
  return erros;
}

/* corpo enviado ao servidor */
export function montarCadastro(perfil, d, p) {
  const corpo = {
    nome: d.nome.trim(), email: d.email.trim(), senha: d.senha, telefone: d.telefone, papel: perfil, consentimento: p.consentimento,
  };
  if (perfil === 'cuidador') {
    corpo.cuidador = { experiencia: p.experiencia, servicos: p.servicos, dias: p.dias, inicio: p.inicio, fim: p.fim };
    if (p.codigo) corpo.convite = p.codigo;
  } else if (p.ligacao === 'codigo') {
    corpo.convite = p.codigo;
  } else if (perfil === 'idoso') {
    corpo.idoso = { dataNascimento: p.nascimento, mobilidade: p.mobilidade };
  } else if (p.ligacao === 'novo') {
    corpo.idoso = { nome: p.nomeIdoso.trim(), dataNascimento: p.nascimento, mobilidade: p.mobilidade };
  }
  return corpo;
}
