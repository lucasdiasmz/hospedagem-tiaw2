# Código do Projeto

Mantenha neste diretório todo o código do projeto. Se necessário, descreva neste arquivo aspectos relevantes da estrutura de diretórios criada para organização do código.

## Estrutura

Cada tela é um módulo React + Vite independente, com a sua própria API. Os módulos se ligam pelo
menu lateral: cada um roda numa porta fixa e aponta para as portas dos outros.

| Pasta | Tela | Web (dev) | API | Dados |
|---|---|---|---|---|
| `acessamob/` | Boas-vindas: escolha de perfil e cadastro inicial | 5180 | — | — |
| `homepage/` | Início (cuidados do dia) | 5173 | 3001 — `homepage/server/` | MongoDB ou `db/db.json` em memória |
| `agenda/` | Agenda | 5174 | 3002 — `agenda/server/` | MongoDB ou `db/db.json` em memória |
| `cadastro-medicamentos/` | Cadastro de medicamentos | 5175 | 3003 — `api-medicamentos/` | MongoDB (obrigatório) |
| `tarefas-rede-apoio/` | Tarefas da rede de apoio | 5176 | 3004 — `api-tarefas-rede/` | MongoDB (obrigatório) |
| `apresentacao-medicamentos/` | Medicamentos (lista do dia) | 5177 | 3005 — `servidor.js` | MongoDB ou `db.json` da pasta |
| `perfil-cuidador/` | Cuidadores | 5178 | 3006 — `servidor.js` | MongoDB ou `db.json` da pasta |
| `Guilherme/` | Perfil do idoso (`/perfil`) e Linha do tempo (`/linha-do-tempo`) | 5179 | 3007 — `Guilherme/backend/` | MongoDB (ou `npm run demo`, em memória) |
| `db/db.json` | modelo de dados global do projeto; popula o banco MongoDB | — | — | — |

Todas as APIs usam o mesmo banco MongoDB (`acessamob`), configurado no `.env` de cada uma
(copie o `.env.example`). Veja o README de cada pasta para os detalhes.

O protótipo antigo da agenda (Next.js, dados fictícios) fica em `../Prototipo-AcessaMob/` e não
entra na navegação: a tela de agenda do sistema é a de `agenda/`.

## Navegação entre as telas

Os endereços ficam em `src/navegacao.js`, um arquivo **igual em todos os módulos**. Ao mudar
uma porta, mude no `vite.config.js` do módulo e nesse arquivo em todos os outros. Fora do
ambiente local, defina as variáveis `VITE_URL_*` no `.env` de cada módulo.

| Item do menu | Abre |
|---|---|
| Início | `homepage/` |
| Agenda | `agenda/` |
| Medicamentos | `apresentacao-medicamentos/` (o atalho "Cadastrar medicamento" abre `cadastro-medicamentos/`) |
| Tarefas | `tarefas-rede-apoio/` |
| Linha do tempo | `Guilherme/` em `/linha-do-tempo` |
| Cuidadores | `perfil-cuidador/` |
| Perfis | `Guilherme/` em `/perfil` |
| Histórico | ainda sem tela |

A tela de boas-vindas (`acessamob/`) é a entrada do sistema: ao concluir o cadastro inicial ela
leva para o Início.

## Como rodar tudo

Em cada pasta de tela e de API, uma vez: `npm install`. Depois, um terminal para cada comando:

| Módulo | API | Web |
|---|---|---|
| Boas-vindas | — | `npm run dev` em `acessamob/` |
| Início | `npm start` em `homepage/server/` | `npm run dev` em `homepage/` |
| Agenda | `npm start` em `agenda/server/` | `npm run dev` em `agenda/` |
| Cadastro de medicamentos | `npm start` em `api-medicamentos/` | `npm run dev` em `cadastro-medicamentos/` |
| Tarefas | `npm start` em `api-tarefas-rede/` | `npm run dev` em `tarefas-rede-apoio/` |
| Medicamentos | `npm run api` em `apresentacao-medicamentos/` | `npm run dev` na mesma pasta |
| Cuidadores | `npm run api` em `perfil-cuidador/` | `npm run dev` na mesma pasta |
| Perfil e Linha do tempo | `npm start` (ou `npm run demo`) em `Guilherme/backend/` | `npm run dev` em `Guilherme/frontend/` |

Comece por http://localhost:5180 (boas-vindas) ou direto em http://localhost:5173 (Início).
As portas são fixas (`strictPort`): se uma estiver ocupada, o módulo avisa em vez de trocar de porta.
