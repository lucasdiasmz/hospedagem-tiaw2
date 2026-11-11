# AcessaMob

- `frontend/` — React + Vite + React Router
- `backend/` — Node.js + Express + MongoDB (Mongoose)

| Sprint | Requisito | Rota no front |
|--------|-----------|---------------|
| 1 | Apresentação do Idoso (perfil) | `/perfil` |
| 2 | Linha do Tempo de relatos (visão do cuidador) | `/linha-do-tempo` |

## ▶️ Como avaliar (sem instalar MongoDB)

Precisa só do [Node.js](https://nodejs.org) (versão 18 ou mais nova). Nesta pasta, rode:

```bash
npm install
npm run demo
```

- O `npm install` instala tudo (back-end e front-end).
- O `npm run demo` sobe um **MongoDB de demonstração embutido**, cria os dados de exemplo, liga a API e abre o site. Na primeira vez ele baixa o MongoDB sozinho (1 ou 2 minutos).
- Quando aparecer `API de demonstração rodando`, abra **http://localhost:5179**.
- Para parar, aperte `Ctrl + C`. Os dados voltam ao exemplo original toda vez que o comando é reiniciado.

O que testar:

| Tela | Onde | O que verificar |
|------|------|-----------------|
| Perfil do idoso (Sprint 1) | Menu **Perfis** | Dados do idoso, alergias, cards, trocar entre Seu Antônio e Dona Lurdes, **Editar perfil** (tente salvar sem nome) |
| Linha do tempo (Sprint 2) | Menu **Linha do tempo** (no celular: **Diário**) | Relatos por Manhã/Tarde/Noite, selos Normal/Atenção/**Urgente**, filtros por tipo (ex.: Dor/Sintoma) e por membro, **Marcar como visto**, setas de dia, **Resumo da semana**, **Passagem de plantão** |

Para ver a versão de celular no computador: `F12` → ícone de celular (ou `Ctrl + Shift + M`).

---

## Rodando com um MongoDB de verdade

Use estes passos se quiser os dados salvos permanentemente (desenvolvimento).

## 1. Banco de dados (MongoDB)

Escolha **uma** das opções:

- **Local:** instale o [MongoDB Community Server](https://www.mongodb.com/try/download/community) (marque "Install MongoDB as a Service" e o MongoDB Compass). Ele fica rodando em `mongodb://127.0.0.1:27017`.
- **Nuvem (Atlas, grátis):** crie um cluster M0 em [mongodb.com/atlas](https://www.mongodb.com/atlas), crie um usuário, libere seu IP em *Network Access* e copie a connection string.

## 2. Back-end

```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

O `npm run seed` apaga e recria os 2 idosos e os relatos de exemplo. Os relatos são gerados **a partir do dia em que o comando roda** (hoje, ontem e dias anteriores), então rode de novo sempre que quiser dados "de hoje" na linha do tempo.

A API sobe em `http://localhost:3007`. Teste em `http://localhost:3007/api/health`.

## 3. Front-end (outro terminal)

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5179`. O Vite redireciona as chamadas `/api` para o back-end.

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/health | Status da API e do banco |
| GET | /api/idosos | Lista todos os idosos |
| GET | /api/idosos/:id | Busca um idoso |
| POST | /api/idosos | Cadastra um idoso |
| PUT | /api/idosos/:id | Atualiza um idoso |
| DELETE | /api/idosos/:id | Remove um idoso (e os relatos dele) |
| GET | /api/idosos/:id/relatos?data=AAAA-MM-DD | Relatos do dia, em ordem de horário |
| GET | /api/idosos/:id/relatos/resumo-semana?data=AAAA-MM-DD | Pontos de atenção dos últimos 7 dias |
| POST | /api/idosos/:id/relatos | Registra um relato |
| PATCH | /api/relatos/:id/visto | Marca um relato como visto |
| DELETE | /api/relatos/:id | Remove um relato |

Exemplo de corpo para `POST /api/idosos/:id/relatos`:

```json
{
  "tipo": "Dor/Sintoma",
  "descricao": "Dor no joelho ao levantar.",
  "nivel": "Atencao",
  "registradoPor": { "nome": "Ana Souza", "papel": "cuidador" }
}
```

| Campo | Valores aceitos |
|-------|-----------------|
| `tipo` | Dor/Sintoma, Humor, Alimentação, Medicação, Sono, Mobilidade/Queda, Higiene, Outro |
| `nivel` | Normal (padrão), Atencao, Urgente |
| `registradoPor.papel` | idoso, cuidador, familiar |

Relatos com nível `Atencao` ou `Urgente` voltam com `precisaAtencao: true`.

## Estrutura

```
backend/src/
├── server.js / app.js
├── config/db.js
├── constants/relatos.js          tipos, níveis e papéis aceitos
├── models/Idoso.js, Relato.js
├── controllers/idosoController.js, relatoController.js
├── routes/idosoRoutes.js, relatoRoutes.js
├── services/resumoSemana.js      monta o resumo dos últimos 7 dias
├── utils/datas.js                datas no fuso de Brasília
├── middlewares/tratarErros.js
└── seed/                         dados de exemplo (npm run seed)

frontend/src/
├── App.jsx                       rotas (/perfil e /linha-do-tempo)
├── pages/PerfilIdoso.jsx         Sprint 1
├── pages/LinhaDoTempo.jsx        Sprint 2
├── components/perfil/            cards e modal do perfil
├── components/linha-do-tempo/    NavegadorData, ResumoDia, FiltroTipos, FiltroMembro,
│                                 GrupoPeriodo, ItemRelato, ResumoSemana, ModalPassagemPlantao
├── hooks/useIdosos.js            carrega idosos e lembra o selecionado
├── services/api.js
└── styles/global.css
```
