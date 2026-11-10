# AcessaMob | Tarefas da rede de apoio

Tela de **tarefas da rede de apoio** (RF006 — criar, delegar e acompanhar tarefas de cuidado entre familiares, Sprint 2) em React + Vite. Segue o mesmo layout e o Design System da tela de cadastro de medicamentos: Lora nos títulos, Inter no texto, a mesma paleta azul e espaçamentos de 4, 8, 16, 24, 32 e 48 px.

O usuário escolhe o idoso e vê:

- **Tarefas da rede**, em abas *A fazer*, *Em andamento* e *Concluído*, com contador. Cada card mostra categoria, responsável e prazo (e o selo *Atrasada*); ao clicar, abre os detalhes e os botões para mudar a tarefa de aba.
- **Criar tarefa**, em uma janela com título, categoria, responsável, prazo, observações, lembretes e, nas compras, a lista de itens com preço. O responsável já vem sugerido: quem tem menos tarefas abertas.
- **Lista de compras do cuidado**, que junta os itens das compras em aberto, soma o total e marca os itens como comprados (a compra é concluída quando todos forem comprados).
- **Divisão do cuidado**, com o percentual das tarefas concluídas que cada membro da rede fez.

A rede de apoio de cada idoso é montada a partir do `Codigo/db/db.json`: o familiar responsável e os cuidadores com vínculo ativo. As tarefas ficam no MongoDB, acessado pela API em `Codigo/api-tarefas-rede`.

## Como rodar

Primeiro ligue a API (veja `Codigo/api-tarefas-rede/README.md`). Depois:

```bash
npm install
npm run dev      # servidor de desenvolvimento em http://localhost:5176
npm run build    # gera a versão final em dist/
```

## Estrutura

```
src/
├── App.jsx                      # monta a página e guarda as tarefas e os avisos
├── main.jsx                     # ponto de entrada
├── components/                  # Sidebar, Topbar, ListaTarefas, FormTarefa, ListaCompras, DivisaoCuidado, Toast
├── data/db.js                   # idosos, catálogos, usuário e membros da rede vindos do db.json
├── services/api.js              # chamadas à API (VITE_API_URL muda o endereço)
├── utils/tarefas.js             # abas, prazos, sugestão de responsável, divisão e validação
└── styles/tarefas-rede-apoio.css
```
