import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const derivar = promisify(scrypt);
const CUSTO = { N: 16384, r: 8, p: 5, maxmem: 64 * 1024 * 1024 };

/* "scrypt$<sal>$<hash>", em base64url */
export async function gerarHash(senha) {
  const sal = randomBytes(16);
  const hash = await derivar(senha.normalize('NFKC'), sal, 32, CUSTO);
  return ['scrypt', sal.toString('base64url'), hash.toString('base64url')].join('$');
}

export async function conferirSenha(senha, guardado) {
  const [tipo, sal, esperado] = String(guardado || '').split('$');
  const valido = Boolean(tipo === 'scrypt' && sal && esperado);
  /* conta inexistente ou sem senha: gasta o mesmo tempo, para não revelar quais e-mails existem */
  const hash = await derivar(
    String(senha).normalize('NFKC'),
    valido ? Buffer.from(sal, 'base64url') : Buffer.alloc(16),
    32,
    CUSTO,
  );
  const alvo = valido ? Buffer.from(esperado, 'base64url') : Buffer.alloc(32);
  return alvo.length === hash.length && timingSafeEqual(hash, alvo) && valido;
}
