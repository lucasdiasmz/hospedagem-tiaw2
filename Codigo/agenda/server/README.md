# AcessaMob — backend da agenda

API em Node.js + Express sobre o modelo de dados de `Codigo/db/db.json`, no mesmo formato do
backend da homepage. Sem configuração, carrega o `db.json` em memória (as mudanças somem ao
reiniciar). Com `MONGODB_URI` definida, usa o MongoDB — o mesmo banco da homepage.

## Como rodar

```bash
cd server
npm install
npm run dev      # http://localhost:3002/api, reinicia ao salvar
npm test         # testes da API (em memória)
```

Com `npm run dev` rodando aqui e no front (`Codigo/agenda`), o Vite repassa `/api` para este servidor.

## Banco do projeto (MongoDB Atlas)

A agenda usa o mesmo banco da homepage (cluster `cluster0.xxusils.mongodb.net`, banco `acessamob`).

1. Peça ao grupo o usuário e a senha do banco (não ficam no repositório).
2. Crie o arquivo `server/.env` com:

   ```
   PORT=3002
   MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster0.xxusils.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   MONGODB_DB=acessamob
   ```

   (é o mesmo `.env` da homepage, só muda a porta)

3. Rode `npm install` e `npm run dev`. O terminal deve mostrar `banco: mongo`.

Na primeira conexão, coleções vazias são populadas com o `db.json`, como na homepage.

`npm run seed` recarrega **só** as coleções da agenda (`eventosAgenda` e `exames`) a partir do
`db.json`, sem mexer nas outras. Mesmo assim, combine com o grupo antes de rodar no banco compartilhado.

Para rodar os testes contra o MongoDB: `TEST_MONGODB_URI=mongodb://localhost:27017 npm test`
(cria um banco `acessamob_teste_agenda_*` por teste).

## Usuário logado

O usuário vem da sessão: um cookie assinado, criado ao entrar e conferido por todas as APIs
(`Codigo/auth`). Cuidadores só acessam a agenda dos idosos com vínculo ativo; clientes,
a dos idosos que cadastraram.

## Rotas

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/saude` | `{ ok, banco: "memoria" \| "mongo" }` |
| GET | `/api/catalogos` | listas de opções (`tiposEvento`, `statusEvento`, `meses`...) |
| GET | `/api/usuarios/eu` | usuário logado + perfil de cuidador ou cliente |
| GET | `/api/idosos` | idosos que o usuário acompanha |
| GET | `/api/idosos/:idosoId` | dados do idoso |
| GET | `/api/idosos/:idosoId/agenda/:mes` | agenda do mês `AAAA-MM`: `{ idosoId, mes, eventos, resumo }` |
| GET | `/api/idosos/:idosoId/agenda/proximos?de=&limite=` | próximos compromissos depois de `de` (padrão: hoje; limite 1–20, padrão 4) |
| GET/POST | `/api/idosos/:idosoId/eventos` | lista / cria compromisso (coleção `eventosAgenda`) |
| GET/PATCH/DELETE | `/api/idosos/:idosoId/eventos/:id` | lê / altera / exclui compromisso |

`data` é `AAAA-MM-DD`; horários são `HH:MM`. Erros voltam como `{ erro: "mensagem" }`.

### Agenda do mês

Cada item de `eventos` é uma ocorrência de um evento num dia:

```json
{
  "chave": "evt-1@2026-10-28", "eventoId": "evt-1", "tipo": "medicamento",
  "data": "2026-10-28", "horario": "08:00", "titulo": "Losartana 50mg", "subtitulo": "Pressão arterial",
  "status": "confirmado", "recorrencia": { "frequencia": "diaria", "diasSemana": ["seg", "..."] },
  "lembrete": { "ativo": true, "minutosAntes": 15 }, "origem": { "colecao": "medicamentos", "id": "med-1" }
}
```

- Eventos com `recorrencia` aparecem em cada dia da semana listado, a partir da `data` de início.
- Status da ocorrência: `cancelado` vale para todas as repetições; nas repetições (fora do dia de
  início) o status volta a `confirmado`; se o item de origem foi registrado como **feito** na tela
  inicial (coleção `registros`), a ocorrência fica `concluido`.
- `resumo`: consultas, exames e visitas do mês (sem os cancelados) e `medicamento` = remédios
  ativos do idoso.

### Criar ou alterar compromisso

```json
{
  "tipo": "consulta", "data": "2026-11-12", "horario": "14:00",
  "titulo": "Consulta: Oftalmologia", "subtitulo": "Dr. Paulo Mendes",
  "status": "confirmado",
  "recorrencia": null,
  "lembrete": { "ativo": true, "minutosAntes": 60 }
}
```

- Obrigatórios na criação: `tipo` (de `catalogos.tiposEvento`), `data`, `horario`, `titulo` (até 80).
- `status` (de `catalogos.statusEvento`, padrão `confirmado`), `subtitulo` (até 80), `recorrencia`
  (`null`, `{ "frequencia": "diaria" }` ou `{ "frequencia": "semanal", "diasSemana": ["seg", "qua"] }`)
  e `lembrete` (`minutosAntes` de 0 a 10080) são opcionais.
- No `PATCH`, envie só os campos que mudam. Compromissos criados pela agenda têm `origem: null`.

## Estrutura

```
src/
├── index.js                 # sobe o servidor
├── app.js                   # Express: usuário logado, rotas e erros
├── seed.js                  # recarrega eventosAgenda e exames do db.json
├── dados/db.js              # lê o db.json e gera ids
├── repositorios/            # memória ou MongoDB, com os mesmos métodos
├── rotas/idosos.js          # idosos, agenda do mês e próximos
├── rotas/eventos.js         # CRUD de eventosAgenda
├── servicos/agenda.js       # expande recorrências, junta registros e monta o resumo
├── servicos/acesso.js       # quem pode ver cada idoso
├── servicos/tempo.js        # data e hora atuais, dia da semana
└── validacao.js             # validação dos campos
```
