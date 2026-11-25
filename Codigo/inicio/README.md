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

## O que a tela mostra

- **Agora**: o próximo cuidado pendente com a hora em destaque e os botões para resolvê-lo
  (feito, recusou, adiar). Sem nada pendente, mostra que o dia está resolvido ou vazio.
- **Apoio**: chamar ajuda, ligar para o contato principal, nova anotação e a rede de apoio
  (convidar ou usar um código). No celular a rede fica na folha "Mais".
- **Hoje**: a régua e a lista do dia inteiro, com o que foi feito, o que está atrasado e as anotações.

O idoso vê a versão simples: só "Já tomei" no cartão e atalhos maiores.

## Estrutura

```
src/
├── App.jsx                  # monta a página e guarda o estado da tela (janelas, avisos)
├── main.jsx                 # ponto de entrada
├── components/              # Saudacao, Agora, Apoio, DiaDeHoje, DialogoNota, Rede, Icones
├── api.js                   # chamadas ao backend (/api)
├── hooks/
│   └── useCuidadosDoDia.js  # usuário, itens do dia e anotações vindos da API; próximo item
├── utils/hora.js            # funções de horário
└── styles/inicio.css        # estilos da tela (o resto vem de design-system/)
```
