export function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento + "T00:00:00");
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesDiff = hoje.getMonth() - nascimento.getMonth();

  if (mesDiff < 0) {
    idade = idade - 1;
  } else if (mesDiff === 0 && hoje.getDate() < nascimento.getDate()) {
    idade = idade - 1;
  }

  return idade;
}

export function formatarData(dataIso) {
  const partes = dataIso.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

export function formatarDataHoje() {
  const texto = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function getIniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  if (partes.length === 1) {
    return partes[0].charAt(0).toUpperCase();
  } else {
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  }
}

export function getPrimeiroNome(nome) {
  return nome.trim().split(/\s+/)[0];
}

export function getNomeCurto(idoso) {
  if (idoso.apelido) {
    return idoso.apelido;
  } else {
    return getPrimeiroNome(idoso.nome);
  }
}

export function getTelLink(telefone) {
  return "tel:" + telefone.replace(/\D/g, "");
}

export function getClasseNivel(nivel) {
  if (nivel === "Independente") {
    return "level-independente";
  } else if (nivel === "Parcial") {
    return "level-parcial";
  } else {
    return "level-dependente";
  }
}

export function getContatoPrincipal(idoso) {
  const principal = idoso.contatos.find(function (contato) {
    return contato.principal;
  });

  if (principal) {
    return principal;
  } else if (idoso.contatos.length > 0) {
    return idoso.contatos[0];
  } else {
    return null;
  }
}

export function ordenarPorHorario(lista) {
  return lista.slice().sort(function (a, b) {
    return a.horario.localeCompare(b.horario);
  });
}
