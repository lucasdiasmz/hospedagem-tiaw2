# Código do Projeto

Mantenha neste diretório todo o código do projeto. Se necessário, descreva neste arquivo aspectos relevantes da estrutura de diretórios criada para organização do código.

## Estrutura

Cada tela é um módulo React + Vite independente, com a sua própria API. Os módulos se ligam pelo
menu lateral: cada um roda numa porta fixa e aponta para as portas dos outros.

| Pasta | Tela | Web (dev) | API | Dados |
|---|---|---|---|---|
| `boas-vindas/` | Boas-vindas: escolha de perfil e cadastro inicial | 5180 | — | — |
| `inicio/` | Início (cuidados do dia) | 5173 | 3001 — `inicio/server/` | MongoDB ou `db/db.json` em memória |
| `agenda/` | Agenda | 5174 | 3002 — `agenda/server/` | MongoDB ou `db/db.json` em memória |
| `cadastro-medicamentos/` | Cadastro de medicamentos | 5175 | 3003 — `cadastro-medicamentos/server/` | MongoDB (obrigatório) |
| `tarefas/` | Tarefas da rede de apoio | 5176 | 3004 — `tarefas/server/` | MongoDB (obrigatório) |
| `medicamentos/` | Medicamentos (lista do dia) | 5177 | 3005 — `servidor.js` | MongoDB ou `db.json` da pasta |
| `cuidadores/` | Cuidadores | 5178 | 3006 — `servidor.js` | MongoDB ou `db.json` da pasta |
| `perfil-linha-do-tempo/` | Perfil do idoso (`/perfil`) e Linha do tempo (`/linha-do-tempo`) | 5179 | 3007 — `perfil-linha-do-tempo/backend/` | MongoDB (ou `npm run demo`, em memória) |
| `db/db.json` | modelo de dados global do projeto; popula o banco MongoDB | — | — | — |

Convenção das pastas: cada pasta leva o nome da tela (o mesmo do menu), com o front-end na raiz
e a API da tela em `server/` dentro dela. As exceções são `medicamentos/` e `cuidadores/`, em que a
API é o arquivo `servidor.js`, e `perfil-linha-do-tempo/`, dividido em `frontend/` e `backend/`.

Todas as APIs usam o mesmo banco MongoDB (`acessamob`), configurado no `.env` de cada uma
(copie o `.env.example`). Veja o README de cada pasta para os detalhes.

O protótipo antigo da agenda (Next.js, dados fictícios) fica em `../Prototipo-AcessaMob/` e não
entra na navegação: a tela de agenda do sistema é a de `agenda/`.

## Padrão visual

Todas as telas seguem o visual da tela inicial (`inicio/src/styles/inicio.css`): fonte Inter, menu
lateral azul-escuro com o logo `logo-acessamob.png`, fundo `#f3f6fc`, azul principal `#1d63dc`,
cartões brancos com cantos de 12–16 px e cartão de destaque em `#0f3a8c`. Em telas estreitas o menu
lateral vira barra inferior. Ao criar uma tela nova, copie os tokens do `:root` e o `Sidebar.jsx`
de um módulo existente.

## Navegação entre as telas

Os endereços ficam em `src/navegacao.js`, um arquivo **igual em todos os módulos**. Ao mudar
uma porta, mude no `vite.config.js` do módulo e nesse arquivo em todos os outros. Fora do
ambiente local, defina as variáveis `VITE_URL_*` no `.env` de cada módulo.

| Item do menu | Abre |
|---|---|
| Início | `inicio/` |
| Agenda | `agenda/` |
| Medicamentos | `medicamentos/` (o atalho "Cadastrar medicamento" abre `cadastro-medicamentos/`) |
| Tarefas | `tarefas/` |
| Linha do tempo | `perfil-linha-do-tempo/` em `/linha-do-tempo` |
| Cuidadores | `cuidadores/` |
| Perfis | `perfil-linha-do-tempo/` em `/perfil` |
| Histórico | ainda sem tela |

A tela de boas-vindas (`boas-vindas/`) é a entrada do sistema: ao concluir o cadastro inicial ela
leva para o Início.

## Como rodar tudo

Em cada pasta de tela e de API, uma vez: `npm install`. Depois, um terminal para cada comando:

| Módulo | API | Web |
|---|---|---|
| Boas-vindas | — | `npm run dev` em `boas-vindas/` |
| Início | `npm start` em `inicio/server/` | `npm run dev` em `inicio/` |
| Agenda | `npm start` em `agenda/server/` | `npm run dev` em `agenda/` |
| Cadastro de medicamentos | `npm start` em `cadastro-medicamentos/server/` | `npm run dev` em `cadastro-medicamentos/` |
| Tarefas | `npm start` em `tarefas/server/` | `npm run dev` em `tarefas/` |
| Medicamentos | `npm run api` em `medicamentos/` | `npm run dev` na mesma pasta |
| Cuidadores | `npm run api` em `cuidadores/` | `npm run dev` na mesma pasta |
| Perfil e Linha do tempo | `npm start` (ou `npm run demo`) em `perfil-linha-do-tempo/backend/` | `npm run dev` em `perfil-linha-do-tempo/frontend/` |

Comece por http://localhost:5180 (boas-vindas) ou direto em http://localhost:5173 (Início).
As portas são fixas (`strictPort`): se uma estiver ocupada, o módulo avisa em vez de trocar de porta.
