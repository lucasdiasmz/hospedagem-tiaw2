# AcessaMob — backend da homepage

API em Node.js + Express sobre o modelo de dados de `Codigo/db/db.json`.
Sem configuração, carrega o `db.json` em memória (as mudanças somem ao reiniciar).
Com `MONGODB_URI` definida, usa o MongoDB — nenhuma outra mudança é necessária.

## Como rodar

```bash
cd server
npm install
npm run dev      # http://localhost:3001/api, reinicia ao salvar
npm test         # testes da API (em memória)
```

Para usar o MongoDB, copie `.env.example` para `.env` e preencha `MONGODB_URI`
(ex.: `mongodb://localhost:27017` ou a URI do MongoDB Atlas). Na primeira conexão, cada coleção
vazia é populada com o conteúdo do `db.json`. Para rodar os testes contra o MongoDB:
`TEST_MONGODB_URI=mongodb://localhost:27017 npm test` (cria um banco `acessamob_teste_*` por teste).

Com `npm run dev` rodando aqui e no front, o Vite repassa `/api` para este servidor.

## Usuário logado

Ainda não há login. O usuário vem do cabeçalho `X-Usuario-Id` (padrão: `usr-1`, Maria, ou
`USUARIO_PADRAO` no `.env`). Cuidadores só acessam os idosos com vínculo ativo; clientes, os
idosos que cadastraram. Quando houver autenticação, basta trocar o middleware em `src/app.js`.

## Rotas

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/saude` | `{ ok, banco: "memoria" \| "mongo" }` |
| GET | `/api/catalogos` | listas de opções (formas de remédio, status...) |
| GET | `/api/usuarios/eu` | usuário logado + perfil de cuidador ou cliente |
| GET | `/api/idosos` | idosos que o usuário acompanha |
| GET | `/api/idosos/:idosoId` | dados do idoso |
| GET | `/api/idosos/:idosoId/dias/:data` | linha do tempo do dia: `{ idosoId, data, itens, anotacoes }` |
| PATCH | `/api/idosos/:idosoId/dias/:data/itens/:itemId` | registra o item no dia (ver abaixo) |
| POST | `/api/idosos/:idosoId/dias/:data/anotacoes` | `{ hora, texto }` (até 120 caracteres) |
| DELETE | `/api/idosos/:idosoId/dias/:data/anotacoes/:id` | só o autor pode apagar |
| GET/POST | `/api/idosos/:idosoId/chamados` | lista / abre chamado de ajuda `{ mensagem? }` |
| PATCH | `/api/idosos/:idosoId/chamados/:id` | `{ status: "aberto" \| "atendido" }` |
| GET/POST | `/api/idosos/:idosoId/medicamentos` | lista / cadastra remédio |
| GET/PATCH/DELETE | `/api/idosos/:idosoId/medicamentos/:id` | |
| … | `/api/idosos/:idosoId/tarefas[/:id]` | mesmo padrão |
| … | `/api/idosos/:idosoId/consultas[/:id]` | mesmo padrão |

`data` é `AAAA-MM-DD`; horários são `HH:MM`. Erros voltam como `{ erro: "mensagem" }`.

### Linha do tempo do dia

Os itens são montados a partir de quatro coleções: `medicamentos` ativos (um item por horário),
`tarefas` ativas do dia da semana, `consultas` da data (não canceladas) e `agendamentos` da data
(visitas de cuidadores). Cada item:

```json
{
  "chave": "medicamento:med-1@08:00", "tipo": "medicamento", "itemId": "med-1",
  "horarioPrevisto": "08:00", "horario": "08:00", "titulo": "Losartana 50 mg", "detalhe": "Pressão arterial",
  "status": "feito", "horarioRegistro": "08:10", "registradoPor": "usr-1", "horarioAdiado": null
}
```

O `PATCH .../itens/:itemId` aceita:
- `status`: `"feito"`, `"recusou"` ou `null` (desfaz). Grava `horarioRegistro` (agora, ou o enviado) e `registradoPor`.
- `horarioAdiado`: `"HH:MM"` para adiar, ou `null` para voltar ao previsto. *Campo novo em `registros`, não existe no `db.json`.*
- `horarioPrevisto`: obrigatório só se o item aparece mais de uma vez no dia (remédio com dois horários).

## Estrutura

```
src/
├── index.js              # sobe o servidor
├── app.js                # usuário logado, rotas gerais e tratamento de erros
├── validacao.js          # validação dos dados recebidos
├── rotas/
│   ├── idosos.js         # idosos, dia, registros, anotações e chamados
│   └── cadastros.js      # CRUD de medicamentos, tarefas e consultas
├── servicos/
│   ├── dia.js            # monta a linha do tempo do dia
│   ├── acesso.js         # quem pode ver qual idoso
│   └── tempo.js          # data/hora local
├── repositorios/
│   ├── index.js          # escolhe memória ou MongoDB pela MONGODB_URI
│   ├── memoria.js
│   └── mongo.js          # uma coleção por lista do db.json; o "id" vira _id
└── dados/db.js           # lê o db.json e gera ids no mesmo padrão ("med-1a2b3c4d")
```
