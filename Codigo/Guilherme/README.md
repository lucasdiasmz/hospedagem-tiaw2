# AcessaMob — Perfil do idoso (Sprint 1)

Tela de apresentação do idoso, feita em React + Vite.

## Como rodar

```bash
npm install
npm run dev
```

Depois abra o endereço que aparecer no terminal (geralmente http://localhost:5173).

## Estrutura

```
src/
├── App.jsx                 layout geral (sidebar + topbar + página)
├── main.jsx                ponto de entrada
├── pages/
│   └── PerfilIdoso.jsx     página do requisito, guarda o estado
├── components/
│   ├── Sidebar.jsx, Topbar.jsx, BottomNav.jsx, Logo.jsx, Icon.jsx, Toast.jsx
│   └── perfil/             cards e modal da tela de perfil
├── data/
│   ├── idosos.js           dados de exemplo
│   └── icons.js            ícones SVG
├── utils/
│   ├── formatadores.js     idade, datas, iniciais etc.
│   └── storage.js          leitura/escrita no localStorage
└── styles/
    └── global.css          design system (cores, fontes, componentes)
```

As edições feitas no perfil ficam salvas no `localStorage` do navegador.
Para voltar aos dados de exemplo, apague a chave `acessamob_idosos` no DevTools (Application → Local Storage).
