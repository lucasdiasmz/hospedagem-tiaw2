# AcessaMob — Agenda (React)

Tela de agenda do AcessaMob em React + Vite, convertida da antiga versão estática (index.html + agenda.css).
A visão principal é a **semana** (7 colunas com os compromissos escritos em cada dia), com opção de
ver o **mês**. Ao lado (ou abaixo, em telas menores) fica o **dia selecionado** como linha do tempo,
com a marcação de "agora", e os **próximos compromissos** (um compromisso que se repete aparece uma
vez só, com "toda terça", por exemplo). O resumo do mês fica numa linha abaixo do título.
Permite criar, concluir, desmarcar e excluir compromissos. No celular, a semana vira uma faixa de
dias e a lista do dia fica logo abaixo.

## Como rodar

A agenda tem o próprio backend em `server/` (porta 3002), que usa o mesmo banco MongoDB da homepage.

```bash
# terminal 1: backend
cd server
npm install
npm run dev      # http://localhost:3002/api

# terminal 2: frontend
npm install
npm run dev      # http://localhost:5174 (o Vite repassa /api para o backend)
npm run build    # gera a versão final em dist/
```

Veja `server/README.md` para configurar o MongoDB Atlas (arquivo `server/.env`).
As portas são diferentes das da homepage (5173 e 3001), então as duas telas rodam juntas.
O item "Início" da barra lateral abre `http://localhost:5173/`; para outro endereço, defina
`VITE_URL_HOMEPAGE` num arquivo `.env` nesta pasta.

## De onde vêm os dados

| Na tela | Origem no banco |
|---|---|
| Compromissos (calendário, lista do dia, próximos dias) | coleção `eventosAgenda` |
| Status "Concluído" de remédios, tarefas e visitas | coleção `registros` (gravada pela tela inicial) |
| Medicamentos em uso | coleção `medicamentos` (`ativo: true`) |
| Tipos, cores dos status, nomes dos meses e dias | documento `catalogos` (`tiposEvento`, `statusEvento`, `meses`, `diasSemanaCurtos`) |
| Usuário logado e idosos | `usuarios`, `cuidadores`/`clientes`, `vinculos`, `idosos` |

Compromissos que se repetem (`recorrencia` diária ou semanal) aparecem em todos os dias
correspondentes a partir da data de início. Remédios e tarefas aparecem na lista do dia, mas não
marcam o calendário nem entram em "Próximos dias", porque acontecem quase todo dia.

## Estrutura

```
src/
├── App.jsx                  # monta a página: cabeçalho, semana ou mês, painel do dia e janelas
├── main.jsx                 # ponto de entrada
├── api.js                   # chamadas ao backend (/api)
├── hooks/
│   └── useAgenda.js         # usuário, idosos, catálogos, visão, dia selecionado, meses carregados;
│                            # criar/alterar/excluir
├── components/
│   ├── Sidebar.jsx          # barra lateral (mesma da homepage)
│   ├── Cabecalho.jsx        # título, idoso, resumo do mês em uma linha, Semana|Mês, "Hoje", "Novo"
│   ├── Semana.jsx           # semana em 7 colunas (no celular, faixa de dias)
│   ├── Mes.jsx              # mês em grade com os compromissos escritos nos dias
│   ├── ChipEvento.jsx       # compromisso compacto usado na semana e no mês
│   ├── PainelDia.jsx        # dia selecionado como linha do tempo + próximos compromissos
│   ├── DialogoNovo.jsx      # formulário de novo compromisso
│   ├── DialogoDetalhes.jsx  # detalhes e ações de um compromisso
│   ├── Dialogo.jsx, Toast.jsx, Icones.jsx
├── utils/datas.js           # datas "AAAA-MM-DD", grade do mês, textos por extenso
├── assets/logo-acessamob.png
└── styles/agenda.css        # CSS da versão estática + janelas, formulário e status
```
