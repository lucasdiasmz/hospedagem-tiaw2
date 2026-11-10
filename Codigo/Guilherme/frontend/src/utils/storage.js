const SELECTED_KEY = "acessamob_idoso_selecionado";

export function carregarSelecionado(idosos) {
  let selecionado = null;
  try {
    selecionado = localStorage.getItem(SELECTED_KEY);
  } catch (erro) {
    selecionado = null;
  }

  const existe = idosos.some(function (idoso) {
    return idoso.id === selecionado;
  });

  if (selecionado && existe) {
    return selecionado;
  } else if (idosos.length > 0) {
    return idosos[0].id;
  } else {
    return null;
  }
}

export function salvarSelecionado(id) {
  try {
    localStorage.setItem(SELECTED_KEY, String(id));
  } catch (erro) {
    console.warn("Não foi possível salvar no localStorage");
  }
}
