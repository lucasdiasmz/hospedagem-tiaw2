# Apresentação de medicamentos

Tela de Thiago Guerra de Araújo para o AcessaMob, feita em React. Usa o `db.json` oficial do grupo, preservando as outras partes do banco.

## Executar com JSON

Use Node.js 22.12 ou superior. No terminal desta pasta:

```powershell
npm install
npm run api
```

Em outro terminal, na mesma pasta:

```powershell
npm run dev
```

Abra http://127.0.0.1:5173/medicamentos.html.

Sem `MONGODB_URI` configurada, o servidor lê e salva no `db.json`.

## Dados do grupo

- O seletor mostra os idosos de `idosos`.
- A tabela mostra somente medicamentos ativos do idoso selecionado.
- Cada horário de `horarios` representa uma dose separada.
- As confirmações são salvas em `registros`, com `tipo: "medicamento"`, `itemId`, `idosoId`, `data` e `horarioPrevisto`.
- Um registro `feito` aparece como **Tomado**. Um registro `recusou` aparece como **Recusado**. Sem registro, a dose fica **Pendente**.
- **Desfazer registro** remove somente a confirmação daquela dose no dia. Uma recusa anterior continua preservada, assim como as tarefas e os registros dos outros idosos.
- O próximo medicamento é a primeira dose pendente na ordem dos horários, incluindo doses atrasadas.
- A data usa o fuso de São Paulo. Recarregue a página quando o dia mudar.

Os medicamentos da tela original já existem no arquivo do grupo e não foram duplicados. Os dados do JSON enviado foram mantidos. Nesta demonstração, o autor das confirmações é `usr-1`, Maria Silva. A integração com o login do grupo deve fornecer o usuário autenticado depois; esta tela local não implementa autenticação ou controle de acesso.

## Usar MongoDB

1. Crie uma instância MongoDB local ou um cluster Atlas.
2. Copie `.env.example` para `.env`.
3. Preencha a URI de conexão no `.env`, somente no seu computador:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=acessamob
PORT=3001
```

No Atlas, use a URI fornecida pelo serviço, configure o usuário do banco e o acesso de rede necessário.

4. Importe os dados do grupo:

```powershell
npm run mongo:importar
```

Cada lista do JSON vira uma coleção, incluindo `medicamentos`, `idosos` e `registros`. Os catálogos são guardados em um documento da coleção `catalogos`. A importação mantém documentos que já tenham o mesmo ID, sem substituí-los.

5. Reinicie a API:

```powershell
npm run api
```

O terminal deve mostrar **Banco: MongoDB**. A aplicação passa a ler e gravar no MongoDB; o JSON não é sincronizado automaticamente. A conexão real só estará validada depois de testar com uma instância configurada.

## Arquivos principais

- `src/App.jsx`: tela, seleção do idoso, busca e ações.
- `src/Estrutura.jsx`: menu lateral e barra superior.
- `src/Detalhes.jsx`: janela de detalhes.
- `src/medicamentos.css`: estilos.
- `src/main.jsx`: inicia o React.
- `servidor.js`: API e acesso a JSON ou MongoDB.
- `db.json`: dados oficiais enviados pelo grupo.
- `vite.config.js`: configuração do React e encaminhamento da API para a porta 3001.

## Conferir e entregar

Para compilar: `npm run build`.

Teste a troca de idoso, a busca, os detalhes, marcar, desfazer e recarregar. Os links para outras telas ainda precisam ser ajustados quando o grupo juntar as partes.

Antes do commit, confira se `node_modules`, `dist` e `.env` estão ignorados e não foram adicionados ao Git. Envie o código, o `package-lock.json`, o `db.json` e o `.env.example`.

O ZIP de entrega deve incluir esses mesmos arquivos, sem dependências instaladas nem senha real. Inclua prints da tela funcionando e da issue. Para o avaliador acessar MongoDB, combine a configuração exigida na atividade; uma cópia do JSON não comprova uma conexão MongoDB ativa.

Se a rede recusar a consulta DNS do Atlas, configure `MONGODB_DNS=1.1.1.1,8.8.8.8` no `.env`. Isso altera somente o resolvedor usado pelo processo da API, sem mudar a rede do computador.
