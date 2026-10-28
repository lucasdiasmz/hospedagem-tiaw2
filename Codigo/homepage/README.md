# AcessaMob (React)

Tela inicial (dashboard) do AcessaMob em React + Vite, convertida da antiga versão estática (homepage.html + homepage.css).

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento em http://localhost:5173
npm run build    # gera a versão final em dist/
```

Os dados da tela (usuário, itens do dia, anotações e pedidos de ajuda) vêm do backend em
`server/` (MongoDB ou memória). Rode `npm run dev` também lá; o Vite repassa `/api` para ele.

## Estrutura

```
src/
├── App.jsx                  # monta a página e guarda o estado da tela (busca, janelas, avisos)
├── main.jsx                 # ponto de entrada
├── components/              # Sidebar, Topbar, Saudacao, CardRemedio, Timeline,
│                            # CardCuidados, CardHumor, Dialogo, DialogoNota, Toast, Icones
├── api.js                   # chamadas ao backend (/api)
├── hooks/
│   └── useCuidadosDoDia.js  # usuário, itens do dia e anotações vindos da API; próximo item
├── utils/hora.js            # funções de horário
└── styles/homepage.css      # mesmo CSS da versão estática
```
