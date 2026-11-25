# Product

## Platform

web

## Users

Dois públicos usam as mesmas telas em proporção parecida:

- **Familiar responsável** (30–60 anos, concilia trabalho e cuidado): organiza a rotina, divide
  tarefas com a família, procura e contrata cuidadores.
- **Cuidador(a) profissional**: registra remédios, anotações e passagem de plantão durante o turno.

Há ainda o próprio **idoso ou pessoa com mobilidade reduzida**, com limitações visuais ou motoras e
pouca afinidade com interfaces complexas. O uso principal é no celular, dentro de casa.

## Product Purpose

Centralizar a rotina de cuidado (medicamentos, agenda, tarefas, diário) e conectar famílias a
cuidadores confiáveis, tirando a sobrecarga de um único familiar. Sucesso: ninguém esquece uma
dose, a família sabe o que aconteceu no dia e encontra ajuda com referências.

## Positioning

Junta, no mesmo lugar, a coordenação da rede de apoio (quem faz o quê, quando) e a busca de
cuidadores com avaliações de outras famílias, pensado desde o início para quem é cuidado também
conseguir usar.

## Operating Context

Projeto do Trabalho Interdisciplinar de Engenharia de Software, PUC Minas, 2026/2. Página
inicial pública e oito telas React + Vite independentes, sete APIs Node (MongoDB Atlas ou JSON), hospedadas na Vercel (site
único) e no Render. Ainda sem login: as APIs usam um usuário padrão.

## Capabilities and Constraints

Implementado: boas-vindas e preferências de acessibilidade, início do dia, agenda (semana/mês),
medicamentos do dia e cadastro, tarefas da rede com lista de compras, linha do tempo com
passagem de plantão, perfil do idoso, busca de cuidadores com filtros, avaliação e solicitação de
atendimento. Em aberto: autenticação (RNF002), notificações push, chat, marketplace de
equipamentos (RF010).

## Brand Commitments

Nome AcessaMob, logo `logo-acessamob.png` (o abraço), slogan "Mais cuidado, todos os dias.",
verde-mata `#16463d` / `#113c34`, menta `#e5ece9`, fontes Plus Jakarta Sans (títulos) e Inter. O verde
substituiu o azul `#1d63dc` em novembro de 2026; a logo manteve o desenho e mudou só de cor.

## Evidence on Hand

Personas, entrevistas e requisitos em `Documentacao/Secoes/`. Dados de exemplo em
`Codigo/db/db.json` (fictícios). Não há depoimentos, números de uso ou parceiros reais.

## Product Principles

1. O que importa agora vem primeiro: o próximo cuidado, a próxima dose.
2. Toda ação frequente cabe em um toque no celular, com alvo grande.
3. Quem é cuidado também precisa conseguir usar: letra maior e alto contraste em todas as telas.
4. Confiança se mostra com referências e avaliações, não com promessas.

## Accessibility & Inclusion

Meta WCAG 2.1 AA (objetivo específico do projeto). Alvos de toque ≥ 48 px, texto base 17 px em
`rem`, letra maior (+19%) e alto contraste globais, foco visível, `prefers-reduced-motion`.
