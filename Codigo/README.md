# Código do Projeto

Mantenha neste diretório todo o código do projeto. Se necessário, descreva neste arquivo aspectos relevantes da estrutura de diretórios criada para organização do código.

## Estrutura

| Pasta | O que tem | Portas (dev) |
|---|---|---|
| `db/db.json` | modelo de dados global do projeto; popula o banco MongoDB | — |
| `homepage/` | tela inicial em React + Vite; backend Node.js em `homepage/server/` | 5173 / API 3001 |
| `agenda/` | tela de agenda em React + Vite; backend Node.js em `agenda/server/` | 5174 / API 3002 |

Os dois backends usam o mesmo banco MongoDB Atlas (`acessamob`), configurado no `.env` de cada
`server/`. Sem `.env`, cada um carrega o `db.json` em memória. Veja o README de cada pasta.
