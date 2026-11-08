# AcessaMob | API de tarefas da rede de apoio

API em Node + Express + Mongoose (MongoDB) usada pela tela `Codigo/tarefas-rede-apoio` (RF006, Sprint 2).

Os documentos têm o mesmo formato do `Codigo/db/db.json` (coleção `tarefasRede`, com `id` como `trd-1`), para facilitar juntar os bancos do grupo depois. Ela roda na porta **3001** para poder ficar ligada junto com a `api-medicamentos` (porta 3000).

## Como rodar

1. Use o mesmo cluster do MongoDB Atlas da `api-medicamentos` (ou crie um gratuito, com usuário do banco e IP liberado em *Network Access*).
2. Copie `.env.example` para `.env` e coloque a sua string de conexão em `MONGODB_URI`. O `.env` não vai para o GitHub.
3. Instale, carregue os dados iniciais e ligue a API:

```bash
npm install
npm run seed     # carrega as tarefas do db.json (apaga as que já existem na coleção)
npm run dev      # API em http://localhost:3001
```

Depois rode a tela em outro terminal (`Codigo/tarefas-rede-apoio`, `npm run dev`).

## Rotas

| Método | Rota | O que faz |
| --- | --- | --- |
| GET | `/tarefas-rede` | Lista todas, ordenadas pelo prazo. Aceita `?idosoId=ido-1` e `?status=a_fazer` |
| POST | `/tarefas-rede` | Cria. O `id` (`trd-N`) é gerado pela API e toda tarefa nova começa em `a_fazer` |
| PATCH | `/tarefas-rede/:id` | Muda de aba: `{ "status": "em_andamento" }` |
| PATCH | `/tarefas-rede/:id` | Marca itens da compra: `{ "itensComprados": [0, 2] }` (posições na lista) |

Regras:

- `status` é `a_fazer`, `em_andamento` ou `concluido`, e `categoria` é `Consulta`, `Compra`, `Medicamento` ou `Outro` (catálogos do `db.json`).
- Só tarefas da categoria `Compra` guardam `itensCompra`; nas outras a lista fica vazia.
- Quando todos os itens de uma compra ficam comprados, a tarefa vai sozinha para `concluido`.
- `concluidoEm` é preenchido ao concluir e volta para `null` ao reabrir.

Erros de validação voltam com status 400 e `{ "erro": "..." }`.

## Estrutura

```
src/
├── server.js                # liga o Express e conecta no MongoDB
├── models/TarefaRede.js     # esquema do Mongoose (validações e catálogos do db.json)
└── routes/tarefasRede.js    # rotas
scripts/seed.js              # carrega o db.json no banco
```
