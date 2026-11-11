export const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

/* erro que vira resposta HTTP com o status indicado */
export class ErroHttp extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

const RE_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
const RE_DATA = /^\d{4}-\d{2}-\d{2}$/;

export function validarHora(hora, campo = 'Horário') {
  if (typeof hora !== 'string' || !RE_HORA.test(hora)) throw new ErroHttp(400, campo + ' inválido (use HH:MM)');
  return hora;
}

/* AAAA-MM-DD e uma data que existe de verdade */
export function validarData(data) {
  const d = new Date(data + 'T00:00:00Z');
  if (!RE_DATA.test(data) || isNaN(d) || d.toISOString().slice(0, 10) !== data) {
    throw new ErroHttp(400, 'Data inválida (use AAAA-MM-DD)');
  }
  return data;
}

export function validarTexto(texto, campo, max) {
  const limpo = typeof texto === 'string' ? texto.trim() : '';
  if (!limpo) throw new ErroHttp(400, campo + ' é obrigatório');
  if (limpo.length > max) throw new ErroHttp(400, campo + ' deve ter no máximo ' + max + ' caracteres');
  return limpo;
}

/* texto que pode vir vazio */
export function validarTextoOpcional(texto, campo, max) {
  if (texto == null || texto === '') return '';
  if (typeof texto !== 'string') throw new ErroHttp(400, campo + ' inválido');
  return texto.trim() ? validarTexto(texto, campo, max) : '';
}

export function validarOpcao(valor, opcoes, campo) {
  if (!opcoes.includes(valor)) throw new ErroHttp(400, campo + ' deve ser um de: ' + opcoes.join(', '));
  return valor;
}

export function validarLista(lista, campo, validarCada) {
  if (!Array.isArray(lista) || !lista.length) throw new ErroHttp(400, campo + ' deve ser uma lista não vazia');
  return [...new Set(lista.map(validarCada))];
}

export function validarBooleano(valor, campo) {
  if (typeof valor !== 'boolean') throw new ErroHttp(400, campo + ' deve ser true ou false');
  return valor;
}

/* Valida o corpo campo a campo. "regras" = { campo: { validar, padrao? } }.
   Na criação, campo ausente usa o padrão (ou é obrigatório); com parcial = true, só os enviados. */
export function validarCorpo(corpo, regras, parcial = false) {
  const saida = {};
  Object.entries(regras).forEach(([campo, { validar, padrao }]) => {
    if (corpo[campo] === undefined) {
      if (parcial) return;
      if (padrao !== undefined) {
        saida[campo] = padrao;
        return;
      }
    }
    saida[campo] = validar(corpo[campo]);
  });
  if (parcial && !Object.keys(saida).length) throw new ErroHttp(400, 'Nenhum campo para atualizar');
  return saida;
}
