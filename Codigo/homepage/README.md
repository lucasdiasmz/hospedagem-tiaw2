# AcessaMob (React)

Tela inicial (dashboard) do AcessaMob em React + Vite, convertida da antiga versão estática (homepage.html + homepage.css).

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento em http://localhost:5173
npm run build    # gera a versão final em dist/
```

## Estrutura

```
src/
├── App.jsx                  # monta a página e guarda o estado da tela (busca, janelas, avisos)
├── main.jsx                 # ponto de entrada
├── components/              # Sidebar, Topbar, Saudacao, CardRemedio, Timeline,
│                            # CardCuidados, CardHumor, Dialogo, DialogoNota, Toast, Icones
├── hooks/
│   ├── useLocalStorage.js   # useState salvo no localStorage
│   └── useCuidadosDoDia.js  # itens do dia, anotações, próximo item e contadores
├── data/cuidados.js         # dados de exemplo (itens do dia e usuária)
├── utils/hora.js            # funções de horário
└── styles/homepage.css      # mesmo CSS da versão estática
```
