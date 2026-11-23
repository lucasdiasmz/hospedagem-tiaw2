/* chamadas ao backend da agenda (server/); em desenvolvimento o Vite repassa /api para http://localhost:3002 */
/* hospedado, VITE_API_URL aponta para o endereço da API (ex.: https://acessamob-agenda.onrender.com) */
const URL_API = (import.meta.env.VITE_API_URL || '') + '/api';

export async function api(caminho, { metodo = 'GET', corpo } = {}) {
  const res = await fetch(URL_API + caminho, {
    method: metodo,
    headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  if (res.status === 204) return null;
  const dados = await res.json().catch(() => null);
  if (!res.ok) throw new Error(dados?.erro || 'Não foi possível falar com o servidor');
  return dados;
}
