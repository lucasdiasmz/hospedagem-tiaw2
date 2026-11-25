# Código do Projeto

Mantenha neste diretório todo o código do projeto. Se necessário, descreva neste arquivo aspectos relevantes da estrutura de diretórios criada para organização do código.

## Estrutura

Cada tela é um módulo React + Vite independente, com a sua própria API. Os módulos se ligam pelo
menu lateral: cada um roda numa porta fixa e aponta para as portas dos outros.

| Pasta | Tela | Web (dev) | API | Dados |
|---|---|---|---|---|
| `pagina-inicial/` | Página inicial pública (raiz do site) | 5181 | — | — |
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

O visual é um só, em [`design-system/`](design-system/README.md): tokens, componentes, menu
(`Shell.jsx`), ícones, diálogo, aviso e navegação. Cada tela importa de lá (`@ds/...`) e guarda no
próprio CSS só o que é dela. É **mobile-first**: no celular, barra no topo e abas embaixo; no
computador, o menu lateral claro com o logo. Identidade: logo e nome AcessaMob, slogan
"Mais cuidado, todos os dias.", verde-mata `#16463d`, menta `#e5ece9`, fontes Plus Jakarta Sans e Inter.
Ao criar uma tela nova, use `<Shell>` e os componentes do design system.

## Hospedagem

O passo a passo para publicar banco, APIs e sites está em [HOSPEDAGEM.md](HOSPEDAGEM.md).

## Navegação entre as telas

Os endereços ficam em `design-system/navegacao.js`, um arquivo só para todas as telas. Ao mudar
uma porta, mude no `vite.config.js` do módulo e nesse arquivo. Fora do
ambiente local, defina as variáveis `VITE_URL_*` no `.env` de cada módulo.

| Item do menu | Abre |
|---|---|
| Início | `inicio/` |
| Agenda | `agenda/` |
| Medicamentos | `medicamentos/` (o atalho "Cadastrar medicamento" abre `cadastro-medicamentos/`) |
| Tarefas | `tarefas/` |
| Linha do tempo | `perfil-linha-do-tempo/` em `/linha-do-tempo` |
| Cuidadores | `cuidadores/` |
| Perfil do idoso | `perfil-linha-do-tempo/` em `/perfil` |

A tela de boas-vindas (`boas-vindas/`) é a entrada do sistema: guarda o perfil, o nome e as
preferências de acessibilidade (valem em todas as telas) e leva para o Início. No celular, Linha do
tempo, Cuidadores e Perfil do idoso ficam na aba "Mais".

## Login e vínculo

A conta fica no servidor (API do início). Quem entra recebe um cookie `HttpOnly` assinado, que as 7 APIs
conferem com o código comum de [`auth/`](auth/). Cada pessoa só vê os idosos vinculados a ela:

- o familiar cadastra a pessoa cuidada; o idoso cadastra a si mesmo;
- os outros entram com um **código de convite** (Início → *Convidar para a rede*), que vale uma vez, por 7 dias.

O papel (idoso, familiar ou cuidador) é conferido no servidor em cada gravação, e o autor dos registros vem da sessão.
`cd auth && npm test` e `npm test` em `inicio/server` e `agenda/server` cobrem essas regras.

No computador, as APIs dividem um segredo gerado em `auth/.segredo-local` (fora do git). Sem MongoDB, a API do
início aceita `SENHA_DEMO=...` para dar uma senha às contas de exemplo, mas contas novas só existem nela: para
testar tudo junto, use um MongoDB.

## O que cada perfil acessa

Definido em `design-system/permissoes.js` (o menu e os botões seguem essa tabela). Quem não passou
pelas boas-vindas é levado para elas antes de abrir qualquer tela.

| Tela | Idoso | Familiar responsável | Cuidador |
|---|---|---|---|
| Início | simplificado (próximo cuidado, remédio, ajuda) | completo | completo |
| Agenda | só ver | cria e edita | ver e marcar como concluído |
| Medicamentos do dia | registrar dose | tudo | registrar dose |
| Cadastro de medicamentos | — | tudo | — |
| Tarefas | — | cria e distribui | só as tarefas dele |
| Linha do tempo | só ver | tudo | marcar como visto e passagem de plantão |
| Perfil do idoso | só ver | edita | só ver |
| Cuidadores | buscar, pedir e avaliar | tudo | — |

Esconder no front só organiza a tela: quem barra são as APIs. Ao mudar uma regra, mude os dois lados.

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
