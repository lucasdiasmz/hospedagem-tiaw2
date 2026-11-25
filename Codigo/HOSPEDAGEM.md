# Hospedagem do AcessaMob

| Parte | Serviço | Quantos |
|---|---|---|
| Banco de dados | MongoDB Atlas (plano M0, gratuito) | 1 cluster, banco `acessamob` |
| APIs | Render (Web Service gratuito) | 7 serviços |
| Sites | Vercel (plano Hobby) | 8 projetos |

Ordem: **banco → APIs → sites → variáveis dos links do menu**. Cada etapa usa os endereços da anterior.

## Login (obrigatório)

As 7 APIs só respondem a quem entrou. O login é um cookie assinado com `AUTH_SECRET`, que precisa ser
**o mesmo valor nas 7 APIs**; sem ele, a API não liga no Render. Faça nesta ordem:

1. **Render → Environment Groups**: confira se existe o grupo `acessamob-auth` com `AUTH_SECRET`, ligado às
   7 APIs (o `render.yaml` cria). Se for à mão, gere um valor com
   `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
2. **Health check** de medicamentos e cuidadores: `/api/saude`. O caminho antigo agora responde 401 e o Render
   recusaria a nova versão.
3. Publique as APIs e depois o site. Com uma parte antiga e outra nova, as telas não abrem.
4. As contas de exemplo do `db.json` não têm senha. Para usar uma, em `inicio/server`, com o `MONGODB_URI` do Atlas
   no `.env`: `npm run senha -- carla.ribeiro@email.com`. O mesmo comando serve para quem esqueceu a senha.

O usuário do Atlas precisa ler o banco `acessamob` e o do perfil (*Read and write to any database*).
O cookie vale para um endereço só, então o login funciona no **site único** e no localhost. Um projeto da
Vercel por tela (seção 3) não serve mais para uso com login.

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
| Perfil e Linha do tempo | `Codigo/perfil-linha-do-tempo/backend` | `npm install` | `npm start` | `MONGODB_URI` (com o banco do perfil no fim), `MONGODB_DB_PRINCIPAL=acessamob` |

- Não defina `PORT`: o Render informa a porta sozinho.
- Todas precisam também de `AUTH_SECRET` (o mesmo valor; veja *Login* acima).
- As APIs não têm CORS: só o site único, no mesmo endereço, consegue chamá-las pelo navegador.
- Sem `MONGODB_URI`, início, agenda, medicamentos e cuidadores usam os arquivos JSON, mas no
  Render o que for salvo some quando o serviço reinicia. Use o Atlas.
- No plano gratuito a API "dorme" após ~15 min sem uso; o primeiro acesso leva cerca de 1 min.

Anote o endereço de cada API (ex.: `https://acessamob-inicio.onrender.com`).
Teste abrindo `<endereço>/api/saude` (início, agenda, medicamentos e cuidadores), `<endereço>/saude`
(cadastro e tarefas) ou `<endereço>/api/health` (perfil).

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

Não é preciso cadastrar variáveis: `design-system/navegacao.js` sabe que, fora do `localhost`, as telas
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

## Observações sobre o banco

- O perfil usa um banco próprio, `acessamob_perfil`: o modelo de idoso dele é diferente do das
  outras telas e o seed dele apaga a coleção `idosos`.
- Nas coleções compartilhadas, o id fica no `_id` (padrão do `inicio`). Os medicamentos também
  têm o campo `id`, usado pelo cadastro.
