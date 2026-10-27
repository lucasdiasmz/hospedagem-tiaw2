import { idososPadrao } from "../data/idosos.js";

const STORAGE_KEY = "acessamob_idosos";
const SELECTED_KEY = "acessamob_idoso_selecionado";

export function carregarIdosos() {
  let salvo = null;
  try {
    salvo = localStorage.getItem(STORAGE_KEY);
  } catch (erro) {
    salvo = null;
  }

  if (salvo) {
    return JSON.parse(salvo);
  } else {
    return JSON.parse(JSON.stringify(idososPadrao));
  }
}

export function salvarIdosos(idosos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(idosos));
  } catch (erro) {
    console.warn("Não foi possível salvar no localStorage");
  }
}

export function carregarSelecionado(idosos) {
  let selecionado = null;
  try {
    selecionado = localStorage.getItem(SELECTED_KEY);
  } catch (erro) {
    selecionado = null;
  }

  const existe = idosos.some(function (idoso) {
    return idoso.id === Number(selecionado);
  });

  if (selecionado && existe) {
    return Number(selecionado);
  } else {
    return idosos[0].id;
  }
}

export function salvarSelecionado(id) {
  try {
    localStorage.setItem(SELECTED_KEY, String(id));
  } catch (erro) {
    console.warn("Não foi possível salvar no localStorage");
  }
}
