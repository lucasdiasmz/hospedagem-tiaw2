/* Middlewares para as APIs em Express. "campo" é o nome do campo de erro que a tela espera. */
import { autenticar } from './acesso.js';

export const MSG_ENTRAR = 'Entre na sua conta para continuar.';
export const MSG_SEM_PERMISSAO = 'Seu perfil não pode fazer isso.';
export const MSG_SEM_ACESSO = 'Você não tem acesso a este idoso.';

export function exigirLogin(repo, campo = 'erro') {
  return async (req, res, next) => {
    try {
      /* resposta pessoal: nenhum cache no caminho pode guardar */
      res.set('Cache-Control', 'no-store');
      const quem = await autenticar(repo, req.headers.cookie);
      if (!quem) return res.status(401).json({ [campo]: MSG_ENTRAR });
      req.usuario = quem.usuario;
      req.perfil = quem.perfil;
      req.papel = quem.papel;
      next();
    } catch (e) {
      next(e);
    }
  };
}

export function exigirPapel(papeis, campo = 'erro') {
  return (req, res, next) => {
    if (papeis.includes(req.papel)) next();
    else res.status(403).json({ [campo]: MSG_SEM_PERMISSAO });
  };
}
