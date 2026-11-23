# Hospedagem do AcessaMob

| Parte | Serviço | Quantos |
|---|---|---|
| Banco de dados | MongoDB Atlas (plano M0, gratuito) | 1 cluster, banco `acessamob` |
| APIs | Render (Web Service gratuito) | 7 serviços |
| Sites | Vercel (plano Hobby) | 8 projetos |

Ordem: **banco → APIs → sites → variáveis dos links do menu**. Cada etapa usa os endereços da anterior.

## 1. Banco (MongoDB Atlas)

1. Crie um cluster M0 em cloud.mongodb.com.
2. *Database Access*: crie um usuário e uma senha.
3. *Network Access*: libere `0.0.0.0/0` (o Render não tem IP fixo).
4. *Connect → Drivers*: copie a string `mongodb+srv://USUARIO:SENHA@...`.
5. Popule o banco uma vez, do seu computador, com essa string no `.env` de cada API:
   - `npm run seed` em `inicio/server`, `agenda/server`, `cadastro-medicamentos/server`,
     `tarefas/server` e `perfil-linha-do-tempo/backend`;
   - `npm run mongo:importar` em `medicamentos`.
   - comece pelo `inicio/server`: ele cria as coleções globais (usuários, idosos, cuidadores...)
     que a API de cuidadores lê. Cuidadores não tem seed próprio.

## 2. APIs (Render)

Em render.com: *New → Web Service*, escolha o repositório e preencha:

| API | Root Directory | Build | Start | Variáveis |
|---|---|---|---|---|
| Início | `Codigo/inicio/server` | `npm install` | `npm start` | `MONGODB_URI`, `MONGODB_DB=acessamob` |
| Agenda | `Codigo/agenda/server` | `npm install` | `npm start` | `MONGODB_URI`, `MONGODB_DB=acessamob` |
| Cadastro de medicamentos | `Codigo/cadastro-medicamentos/server` | `npm install` | `npm start` | `MONGODB_URI` (com `/acessamob` no fim) |
| Tarefas | `Codigo/tarefas/server` | `npm install` | `npm start` | `MONGODB_URI` (com `/acessamob` no fim) |
| Medicamentos | `Codigo/medicamentos` | `npm install` | `npm run api` | `MONGODB_URI`, `MONGODB_DB=acessamob` |
| Cuidadores | `Codigo/cuidadores` | `npm install` | `npm run api` | `MONGODB_URI`, `MONGODB_DB=acessamob` |
| Perfil e Linha do tempo | `Codigo/perfil-linha-do-tempo/backend` | `npm install` | `npm start` | `MONGODB_URI` (com `/acessamob` no fim), `FRONTEND_URL` |

- Não defina `PORT`: o Render informa a porta sozinho.
- `FRONTEND_URL` é o endereço do site do perfil na Vercel (sem `/` no fim). Defina depois da etapa 3.
- Opcional: `CORS_ORIGIN` limita quem pode chamar as APIs de início, agenda, medicamentos e
  cuidadores (padrão: qualquer site).
- Sem `MONGODB_URI`, início, agenda, medicamentos e cuidadores usam os arquivos JSON, mas no
  Render o que for salvo some quando o serviço reinicia. Use o Atlas.
- No plano gratuito a API "dorme" após ~15 min sem uso; o primeiro acesso leva cerca de 1 min.

Anote o endereço de cada API (ex.: `https://acessamob-inicio.onrender.com`).
Teste abrindo `<endereço>/api/saude` (início e agenda) ou `<endereço>/api/idosos` (medicamentos).

## 3. Sites (Vercel)

Em vercel.com: *Add New → Project*, o mesmo repositório 8 vezes, mudando o *Root Directory*.
O framework (Vite) é detectado sozinho.

| Site | Root Directory | `VITE_API_URL` |
|---|---|---|
| Boas-vindas | `Codigo/boas-vindas` | — |
| Início | `Codigo/inicio` | endereço da API do Início |
| Agenda | `Codigo/agenda` | endereço da API da Agenda |
| Medicamentos | `Codigo/medicamentos` | endereço da API de Medicamentos |
| Cadastro de medicamentos | `Codigo/cadastro-medicamentos` | endereço da API de Cadastro |
| Tarefas | `Codigo/tarefas` | endereço da API de Tarefas |
| Cuidadores | `Codigo/cuidadores` | endereço da API de Cuidadores |
| Perfil e Linha do tempo | `Codigo/perfil-linha-do-tempo/frontend` | endereço da API do Perfil |

`VITE_API_URL` é só o endereço do Render, sem `/api` e sem `/` no fim.
Sem ela, o site usa o endereço local (como em desenvolvimento).

## 4. Links do menu entre as telas

Com os 8 sites no ar, cadastre **em todos os projetos da Vercel** as variáveis abaixo (os nomes
estão em `src/navegacao.js`) e faça *Redeploy* de cada um:

| Variável | Valor (exemplo) |
|---|---|
| `VITE_URL_BOAS_VINDAS` | `https://acessamob-boas-vindas.vercel.app/` |
| `VITE_URL_HOMEPAGE` | `https://acessamob-inicio.vercel.app/` |
| `VITE_URL_AGENDA` | `https://acessamob-agenda.vercel.app/` |
| `VITE_URL_MEDICAMENTOS` | `https://acessamob-medicamentos.vercel.app/` |
| `VITE_URL_CADASTRO_MEDICAMENTOS` | `https://acessamob-cadastro.vercel.app/` |
| `VITE_URL_TAREFAS` | `https://acessamob-tarefas.vercel.app/` |
| `VITE_URL_CUIDADORES` | `https://acessamob-cuidadores.vercel.app/` |
| `VITE_URL_LINHA_DO_TEMPO` | `https://acessamob-perfil.vercel.app/linha-do-tempo` |
| `VITE_URL_PERFIS` | `https://acessamob-perfil.vercel.app/perfil` |

Dica: na Vercel, *Settings → Environment Variables* aceita colar várias linhas `NOME=valor` de
uma vez. O Vite grava esses valores no build, por isso o *Redeploy* é necessário a cada mudança.
