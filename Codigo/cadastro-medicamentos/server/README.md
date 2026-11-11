# AcessaMob | API de medicamentos

API em Node + Express + Mongoose (MongoDB) usada pela tela `Codigo/cadastro-medicamentos`.

Os documentos têm o mesmo formato do `Codigo/db/db.json` (inclusive o campo `id`, como `med-1`), para facilitar juntar os bancos do grupo depois.

## Como rodar

1. Crie um cluster gratuito no [MongoDB Atlas](https://www.mongodb.com/atlas), crie um usuário do banco e libere o seu IP em *Network Access*.
2. Copie `.env.example` para `.env` e coloque a sua string de conexão em `MONGODB_URI`. O `.env` não vai para o GitHub.
3. Instale, carregue os dados iniciais e ligue a API:

```bash
npm install
npm run seed     # carrega os medicamentos do db.json (apaga os que já existem na coleção)
npm run dev      # API em http://localhost:3003
```

Depois rode a tela em outro terminal (`Codigo/cadastro-medicamentos`, `npm run dev`).

## Rotas

| Método | Rota | O que faz |
| --- | --- | --- |
| GET | `/medicamentos` | Lista todos. Aceita `?idosoId=ido-1` |
| POST | `/medicamentos` | Cadastra. O `id` (`med-N`) é gerado pela API |
| PATCH | `/medicamentos/:id` | Ativa ou desativa: `{ "ativo": false }` |

Erros de validação voltam com status 400 e `{ "erro": "..." }`.

## Estrutura

```
src/
├── server.js                # liga o Express e conecta no MongoDB
├── models/Medicamento.js    # esquema do Mongoose (validações e catálogos do db.json)
└── routes/medicamentos.js   # rotas
scripts/seed.js              # carrega o db.json no banco
```
