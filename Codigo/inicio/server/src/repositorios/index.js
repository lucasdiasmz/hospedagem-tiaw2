import { criarRepositorioMemoria } from './memoria.js';
import { criarRepositorioMongo } from './mongo.js';

/* MongoDB quando MONGODB_URI estiver definida; senão, guarda tudo em memória */
export function criarRepositorio(env = process.env) {
  if (env.MONGODB_URI) return criarRepositorioMongo(env.MONGODB_URI, env.MONGODB_DB || 'acessamob');
  return criarRepositorioMemoria();
}
