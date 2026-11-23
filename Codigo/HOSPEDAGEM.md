# Hospedagem do AcessaMob

| Parte | Serviço | Quantos |
|---|---|---|
| Banco de dados | MongoDB Atlas (plano M0, gratuito) | 1 cluster, banco `acessamob` |
| APIs | Render (Web Service gratuito) | 7 serviços |
| Sites | Vercel (plano Hobby) | 8 projetos |

Ordem: **banco → APIs → sites → variáveis dos links do menu**. Cada etapa usa os endereços da anterior.

## Site único (recomendado)

Todas as telas num endereço só, num único projeto da Vercel:

- Vercel → *Add New → Project* → repositório, **Root Directory `./`** (a raiz), preset *Other*.
  O `vercel.json` da raiz já define o build (`node Codigo/build-unificado.mjs`) e a saída (`dist`).
- As telas ficam em `/boas-vindas/`, `/inicio/`, `/agenda/`, `/medicamentos/`,
  `/cadastro-medicamentos/`, `/tarefas/`, `/cuidadores/` e `/idoso/perfil` + `/idoso/linha-do-tempo`;
  a raiz `/` abre as boas-vindas.
- As chamadas de API vão para `/srv/<api>/...` no mesmo endereço, e a Vercel repassa ao Render
  (as 7 APIs continuam lá, criadas pelo `render.yaml`).
- Para testar no computador: `node Codigo/build-unificado.mjs` gera o site em `dist/`.

As seções abaixo descrevem o banco, as APIs e, como alternativa, um projeto da Vercel por tela.

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

Em vercel.com: *Add New → Project*, o mesmo repositório 8 vezes, clicando em *Import single
project* no módulo certo e usando exatamente estes nomes de projeto:

| Site | Root Directory | Nome do projeto (endereço) |
|---|---|---|
| Boas-vindas | `Codigo/boas-vindas` | `acessamob-boas-vindas` |
| Início | `Codigo/inicio` | `acessamob-inicio` |
| Agenda | `Codigo/agenda` | `acessamob-agenda` |
| Medicamentos | `Codigo/medicamentos` | `acessamob-medicamentos` |
| Cadastro de medicamentos | `Codigo/cadastro-medicamentos` | `acessamob-cadastro` |
| Tarefas | `Codigo/tarefas` | `acessamob-tarefas` |
| Cuidadores | `Codigo/cuidadores` | `acessamob-cuidadores` |
| Perfil e Linha do tempo | `Codigo/perfil-linha-do-tempo/frontend` | `acessamob-perfil` |

Não é preciso cadastrar variáveis: `src/navegacao.js` sabe que, fora do `localhost`, as telas
ficam em `https://acessamob-<nome>.vercel.app` e as APIs em
`https://acessamob-<api>-api.onrender.com` (os nomes do `render.yaml`).

## 4. Se algum endereço mudar

Se a Vercel ou o Render derem outro endereço (nome já usado, domínio próprio), cadastre no projeto
da Vercel a variável correspondente e faça *Redeploy* (o Vite grava os valores no build):

- `VITE_API_URL`: endereço da API daquela tela no Render, sem `/api` e sem `/` no fim;
- `VITE_URL_BOAS_VINDAS`, `VITE_URL_HOMEPAGE`, `VITE_URL_AGENDA`, `VITE_URL_MEDICAMENTOS`,
  `VITE_URL_CADASTRO_MEDICAMENTOS`, `VITE_URL_TAREFAS`, `VITE_URL_CUIDADORES`,
  `VITE_URL_LINHA_DO_TEMPO`, `VITE_URL_PERFIS`: endereços das telas, usados pelo menu
  (em todos os projetos).

Na API do perfil, `FRONTEND_URL` (no Render) precisa ser o endereço do site do perfil.

## Observações sobre o banco

- O perfil usa um banco próprio, `acessamob_perfil`: o modelo de idoso dele é diferente do das
  outras telas e o seed dele apaga a coleção `idosos`.
- Nas coleções compartilhadas, o id fica no `_id` (padrão do `inicio`). Os medicamentos também
  têm o campo `id`, usado pelo cadastro.
