# AcessaMob | Cadastro de medicamentos

Tela de **cadastro de medicamentos** (requisito 7 do planejamento da sprint, tipo CI) em React + Vite. O visual segue o Design System do projeto: Lora nos títulos, Inter no texto, cores `#050315`, `#DDE5E9`, `#406399` e `#CAD6EF` e espaçamentos de 4, 8, 16, 24, 32 e 48 px.

O usuário informa nome, dosagem, forma, frequência, horários e observações. Os medicamentos cadastrados aparecem em cards ao lado e ficam salvos no `localStorage` do navegador.

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento em http://localhost:5173
npm run build    # gera a versão final em dist/
```

## Estrutura

```
src/
├── App.jsx                      # monta a página e guarda a lista e os avisos
├── main.jsx                     # ponto de entrada
├── components/                  # Navbar, FormMedicamento, ListaMedicamentos, Toast
├── hooks/useLocalStorage.js     # useState salvo no localStorage
├── utils/medicamentos.js        # formas, frequências, horários padrão e validação
└── styles/cadastro-medicamentos.css
```
