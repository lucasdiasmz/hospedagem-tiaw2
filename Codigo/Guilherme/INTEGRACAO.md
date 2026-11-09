# Guia de integração — AcessaMob

Como juntar as partes de cada integrante num software único (um back-end, um front-end, um banco).

---

## 1. Combinar com o grupo antes de começar

- [ ] **Projeto base:** qual parte vira a base. Normalmente a mais completa ou a que já tem o layout que todo mundo segue.
- [ ] **Layout único:** uma só `Sidebar`, `Topbar`, `BottomNav` e um só `global.css`, com as cores do Design System.
- [ ] **Versões:** React 18, Vite 5, React Router 6, Express 4, Mongoose 8.
- [ ] **Banco:** um banco só (`acessamob`), local ou Atlas, com a mesma `MONGODB_URI` no `.env` de todo mundo.
- [ ] **Models compartilhados:** quem é o "dono" de cada coleção (`idosos`, `relatos`, `cuidadores`, `agendamentos`...). Ninguém cria um segundo model para a mesma coisa.
- [ ] **Usuário logado:** se alguém fizer login, todo mundo passa a ler o usuário de um lugar só.

---

## 2. Estrutura final

```
Codigo/app/
├── backend/
│   ├── package.json              dependências de todos
│   ├── .env.example
│   └── src/
│       ├── app.js                registra as rotas de todos
│       ├── server.js
│       ├── config/db.js
│       ├── models/               um arquivo por coleção
│       ├── controllers/
│       ├── routes/
│       ├── services/ utils/ constants/ middlewares/
│       └── seed/                 um seed só, com os dados de todos
└── frontend/
    ├── package.json
    ├── vite.config.js            proxy /api -> http://localhost:3000
    └── src/
        ├── App.jsx               rotas de todos
        ├── components/           Sidebar, Topbar, BottomNav, Icon, Toast, Estado...
        ├── components/<modulo>/  componentes de cada parte
        ├── pages/                uma página por tela
        ├── services/api.js       chamadas à API de todos
        ├── hooks/ utils/ data/
        └── styles/global.css
```

---

## 3. Passo a passo no Git

Cada integrante tem o código na própria branch, em `Codigo/<Nome>`.

**3.1 Criar a branch de integração** (quem for integrar):

```bash
git checkout main
git pull
git checkout -b integracao
git fetch origin
```

**3.2 Trazer a pasta de cada integrante** sem fazer merge da branch inteira:

```bash
git checkout origin/Guilherme -- Codigo/Guilherme
git checkout origin/NomeDaBranch -- Codigo/NomeDaPasta
```

**3.3 Copiar o projeto base** para `Codigo/app`, rodar e garantir que funciona sozinho.

**3.4 Encaixar uma parte por vez** (seções 4 e 5). Depois de cada parte:

```bash
cd Codigo/app/backend && npm install && npm run seed && npm run dev
cd Codigo/app/frontend && npm install && npm run dev
```

Testar no navegador e commitar:

```bash
git add Codigo/app
git commit -m "integra: <parte do fulano>"
```

**3.5 Abrir o PR** `integracao` → `main` quando todas as partes estiverem funcionando juntas.

---

## 4. Encaixar uma parte no back-end

1. Copiar `models/`, `controllers/`, `routes/` (e `services/`, `utils/`, `constants/`, se houver) para as pastas do `app/backend/src`.
2. Se o arquivo já existir com o mesmo nome (ex.: dois `Idoso.js`), **não sobrescrever**: juntar os campos num model só.
3. Registrar as rotas no `app.js`:
   ```js
   import agendaRoutes from "./routes/agendaRoutes.js";
   app.use("/api/agendamentos", agendaRoutes);
   ```
   Os `app.use` das rotas ficam **antes** do `rotaNaoEncontrada` e do `tratarErros`.
4. Juntar as `dependencies` do `package.json` (manter a versão mais nova quando repetir).
5. Juntar os seeds num `seed.js` só: limpar e inserir na ordem certa (primeiro `idosos`, depois o que referencia o idoso).
6. Juntar as variáveis novas no `.env.example`.

## 5. Encaixar uma parte no front-end

1. Copiar a página para `pages/` e os componentes para `components/<modulo>/`.
2. Adicionar a rota no `App.jsx`:
   ```jsx
   <Route path="/agenda" element={<Agenda />} />
   ```
3. Ligar o item do menu na `Sidebar.jsx` e na `BottomNav.jsx`, colocando a `rota` no item (ex.: `rota: "/agenda"`).
4. Juntar as funções no `services/api.js`.
5. Juntar o CSS no `global.css`. Classes novas com **prefixo do módulo** (ex.: `.agenda-card`) para não brigar com `.card`, `.btn` etc.
6. Reaproveitar o que já existe: `Icon`, `Toast`, `EstadoCarregando/Erro/Vazio`, `SeletorIdoso`, `useIdosos`.

---

## 6. Parte do Guilherme (Sprints 1 e 2)

| Onde | Arquivos |
|------|----------|
| Back — models | `Idoso.js`, `Relato.js` |
| Back — rotas | `idosoRoutes.js` (`/api/idosos`, inclui `/api/idosos/:id/relatos`), `relatoRoutes.js` (`/api/relatos`) |
| Back — outros | `controllers/idosoController.js`, `controllers/relatoController.js`, `services/resumoSemana.js`, `utils/datas.js`, `constants/relatos.js`, `middlewares/tratarErros.js` |
| Front — páginas | `pages/PerfilIdoso.jsx` (`/perfil`), `pages/LinhaDoTempo.jsx` (`/linha-do-tempo`) |
| Front — componentes | `components/perfil/`, `components/linha-do-tempo/` |
| Front — compartilháveis | `Sidebar`, `Topbar`, `BottomNav`, `Icon`, `Toast`, `Estado`, `SeletorIdoso`, `hooks/useIdosos.js` |

**Pontos de atenção da parte do Guilherme:**

- O model `Idoso` pode virar o model **oficial** do grupo. Quem precisar de mais campos adiciona nele.
- O usuário logado está fixo em `frontend/src/data/usuario.js` (Maria Silva, Cuidador(a)). Quando existir login, é só trocar esse arquivo pela leitura do usuário real.
- A linha do tempo lê os relatos da coleção `relatos`. Se alguém fizer a tela de **registrar relato**, deve usar `POST /api/idosos/:id/relatos` com os tipos, níveis e papéis do `README.md`.
- O idoso selecionado fica salvo no navegador (`localStorage`, chave `acessamob_idoso_selecionado`), e as telas de todo mundo podem usar o mesmo `useIdosos()`.

---

## 7. Checklist final

- [ ] `npm run seed` roda sem erro e popula todas as coleções.
- [ ] Todas as telas abrem pelo menu (desktop e celular).
- [ ] Nenhum erro no console do navegador nem no terminal da API.
- [ ] Um só `node_modules` por projeto e nenhum `.env` commitado.
- [ ] `README.md` do `Codigo/app` atualizado com como rodar e com as rotas de todos.
