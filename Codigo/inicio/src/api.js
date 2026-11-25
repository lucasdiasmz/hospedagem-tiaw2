/* chamadas ao backend (server/); em desenvolvimento o Vite repassa /api para http://localhost:3001 */
import { urlApi } from '@ds/navegacao.js';
import { pedir } from '@ds/sessao.js';

/* local: o Vite repassa /api para server/; publicado: a API no Render (src/navegacao.js) */
const URL_API = urlApi('inicio') + '/api';

export async function api(caminho, { metodo = 'GET', corpo } = {}) {
  const res = await pedir(URL_API + caminho, {
    method: metodo,
    headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  if (res.status === 204) return null;
  const dados = await res.json().catch(() => null);
  if (!res.ok) throw new Error(dados?.erro || 'Não foi possível falar com o servidor');
  return dados;
}
