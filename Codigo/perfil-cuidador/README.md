# Perfil do cuidador — Sprint 2

Parte individual de Thiago Guerra de Araújo: visualização do perfil profissional do cuidador (RF002).

## Executar

Use Node.js 22.12 ou superior. No terminal desta pasta:

```powershell
npm install
npm run api
```

Em outro terminal, na mesma pasta:

```powershell
npm run dev
```

Abra http://127.0.0.1:5174/perfil.html. Selecione um cuidador para abrir seu perfil. Exemplo de acesso direto: http://127.0.0.1:5174/perfil.html?id=cui-1.

## Dados

Sem uma conexão configurada, a API lê o `db.json` oficial do grupo, incluído nesta pasta. Para usar MongoDB, copie `.env.example` para `.env` e configure a URI e o nome do banco. As coleções `usuarios`, `cuidadores`, `avaliacoes` e `clientes` devem estar importadas. O módulo de medicamentos já tem o comando de importação dos dados do grupo.

A API consulta o MongoDB quando `MONGODB_URI` está preenchida. Nunca envie o `.env` ao GitHub. Esta tela apenas consulta dados; não grava ou altera perfis. Nome do profissional vem de `usuarios`, os dados profissionais vêm de `cuidadores` e as avaliações vêm de `avaliacoes`. Informações de login não são retornadas.

## Arquivos

- `src/App.jsx`: consulta, perfil e abas.
- `src/Estrutura.jsx`: menu e barra superior do grupo.
- `src/perfil.css`: estilos responsivos.
- `src/main.jsx`: inicia o React.
- `servidor.js`: API de consulta JSON/MongoDB.
- `db.json`: exemplos oficiais do grupo.
- `vite.config.js`: executa o React na porta 5174 e encaminha `/api` à API na porta 3002.

`GET /api/cuidadores` fornece a lista básica de identificação. `GET /api/cuidadores/:id` fornece o perfil público, incluindo serviços, disponibilidade e avaliações existentes.

## Conferir

Execute `npm run build` para compilar. Para testar a compilação, mantenha a API ligada e execute `npm run preview`.

Confira a abertura de cuidadores diferentes, as quatro abas, a volta à lista e o uso no celular. O perfil `cui-2` não tem referências. Os exemplos não têm fotografias; a tela mostra as iniciais. `perfil.html?id=inexistente` deve mostrar perfil não encontrado. Se a API for desligada, deve aparecer uma mensagem com opção de tentar novamente.

O layout foi baseado no perfil acessível do Figma do grupo, com as abas Sobre, Serviços e preços, Avaliações e Disponibilidade, adaptado ao padrão azul da entrega anterior. Não são inventadas notas ou fotos para imitar os dados de demonstração do Figma.

Cadastro, autenticação, busca completa e agendamento são partes de outros módulos. Os links externos do menu precisam ser ajustados quando o grupo reunir as telas. O botão de agendamento não foi implementado sem uma rota de destino disponível.

## Entrega

Não enviar `node_modules`, `dist` ou `.env` ao GitHub. O `package-lock.json`, o `db.json` e o `.env.example` acompanham o código. O módulo de medicamentos permanece separado.
