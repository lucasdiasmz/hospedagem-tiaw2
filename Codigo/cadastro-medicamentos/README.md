# AcessaMob | Cadastro de medicamentos

Tela de **cadastro de medicamentos** (requisito 7 do planejamento da sprint, tipo CI) em React + Vite. O visual segue o Design System do projeto: Lora nos títulos, Inter no texto, cores `#050315`, `#DDE5E9`, `#406399` e `#CAD6EF` e espaçamentos de 4, 8, 16, 24, 32 e 48 px.

O usuário escolhe o idoso e informa nome, dosagem, categoria, forma, via, frequência, horários e observações. Os medicamentos ficam no MongoDB, acessado pela API em `Codigo/cadastro-medicamentos/server`. Idosos e catálogos (formas e vias) vêm de `Codigo/db/db.json`.

## Como rodar

Primeiro ligue a API (veja `Codigo/cadastro-medicamentos/server/README.md`). Depois:

```bash
npm install
npm run dev      # servidor de desenvolvimento em http://localhost:5175
npm run build    # gera a versão final em dist/
```

## Estrutura

```
src/
├── App.jsx                      # monta a página e guarda a lista e os avisos
├── main.jsx                     # ponto de entrada
├── components/                  # Navbar, FormMedicamento, ListaMedicamentos, Toast
├── data/db.js                   # idosos, catálogos e usuário vindos do db.json
├── services/api.js              # chamadas à API (VITE_API_URL muda o endereço)
├── utils/medicamentos.js        # frequências, horários padrão, ids e validação
└── styles/cadastro-medicamentos.css
```
