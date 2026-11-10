# AcessaMob — Agenda de Informações

Protótipo independente da funcionalidade de agenda de medicamentos e consultas, construído com Next.js, React, JavaScript/JSX e CSS convencional.

## Requisitos

- Node.js 20.9 ou superior
- npm
- Navegador moderno

## Como executar

No terminal, estando nesta pasta (`Codigo`), execute:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` no navegador. Para validar a versão de produção, execute `npm run build` e depois `npm start`.

## Estrutura

- `app/`: página e layout da aplicação, escritos em JSX.
- `components/`: componentes reutilizáveis da interface.
- `styles/`: folha de estilos CSS global.
- `lib/`: dados iniciais e constantes de apoio.
- `package.json`: dependências e comandos npm.

Como o projeto utiliza React com Next.js, a estrutura da interface fica em arquivos JSX, que o React transforma em HTML. Não é necessário criar arquivos `.html` independentes para cada tela.

## Funcionalidades do protótipo

- Abas de medicamentos e consultas;
- Pesquisa textual e filtros por status, período ou horário;
- Cadastro, edição e exclusão de registros;
- Seleção visual de um registro;
- Persistência local no navegador via `localStorage`;
- Interface responsiva e estados de confirmação/erro.

Os registros iniciais são fictícios e servem somente para demonstração. O projeto não possui backend, autenticação, sincronização entre dispositivos nem envio de notificações médicas. Não utilize os dados ou textos demonstrativos como orientação clínica.

O wireframe de referência está na pasta `../Referencias/wireframe.png`; o guia técnico está um nível acima, em `../GUIA_IMPLEMENTACAO_AcessaMob.docx`.
