import mongoose from 'mongoose';
import { repoMongo } from '../../../auth/repos.js';

/* leitura das coleções comuns (usuários, vínculos, idosos) pela mesma conexão */
export const repo = repoMongo(() => mongoose.connection.db);
