/* Sessão: um cookie HttpOnly assinado (HMAC-SHA256), conferido por todas as APIs com o mesmo AUTH_SECRET. */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

export const COOKIE = 'acessamob_sessao';
const DURACAO = 7 * 24 * 60 * 60;
const ARQUIVO_LOCAL = new URL('./.segredo-local', import.meta.url);

export function emProducao() {
  return Boolean(process.env.RENDER) || process.env.NODE_ENV === 'production';
}

/* publicado: AUTH_SECRET é obrigatório. No computador, as APIs dividem um segredo gerado uma vez (fora do git). */
let segredo;
export function carregarSegredo() {
  if (segredo) return segredo;
  if (process.env.AUTH_SECRET) {
    if (process.env.AUTH_SECRET.length < 32) throw new Error('AUTH_SECRET precisa ter pelo menos 32 caracteres.');
    segredo = process.env.AUTH_SECRET;
  } else if (emProducao()) {
    throw new Error('Defina AUTH_SECRET (o mesmo valor nas 7 APIs). Veja Codigo/HOSPEDAGEM.md.');
  } else {
    try {
      writeFileSync(ARQUIVO_LOCAL, randomBytes(48).toString('base64url'), { flag: 'wx', mode: 0o600 });
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
    }
    segredo = readFileSync(ARQUIVO_LOCAL, 'utf8');
  }
  return segredo;
}

function assinar(texto) {
  return createHmac('sha256', carregarSegredo()).update(texto).digest('base64url');
}

/* versao muda quando a senha muda: as sessões antigas deixam de valer */
export function criarToken(usuarioId, versao = 0, agora = Date.now()) {
  const dados = { u: usuarioId, v: versao, e: Math.floor(agora / 1000) + DURACAO };
  const corpo = Buffer.from(JSON.stringify(dados)).toString('base64url');
  return corpo + '.' + assinar(corpo);
}

export function lerToken(token, agora = Date.now()) {
  const [corpo, assinatura, sobra] = String(token || '').split('.');
  if (!corpo || !assinatura || sobra !== undefined) return null;
  const certa = Buffer.from(assinar(corpo));
  const recebida = Buffer.from(assinatura);
  if (certa.length !== recebida.length || !timingSafeEqual(certa, recebida)) return null;
  try {
    const { u, v, e } = JSON.parse(Buffer.from(corpo, 'base64url').toString());
    if (typeof u !== 'string' || !(e > agora / 1000)) return null;
    return { usuarioId: u, versao: v || 0 };
  } catch {
    return null;
  }
}

export function lerCookie(cabecalho) {
  const par = String(cabecalho || '').split(/;\s*/).find((c) => c.startsWith(COOKIE + '='));
  return par ? lerToken(par.slice(COOKIE.length + 1)) : null;
}

function cookie(valor, idade) {
  return `${COOKIE}=${valor}; Path=/; Max-Age=${idade}; HttpOnly; SameSite=Lax` + (emProducao() ? '; Secure' : '');
}

export const cookieDeEntrada = (usuario) => cookie(criarToken(usuario.id, usuario.versaoSessao), DURACAO);
export const cookieDeSaida = () => cookie('', 0);
