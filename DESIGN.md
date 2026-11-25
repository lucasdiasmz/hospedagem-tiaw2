# Design

Fonte da verdade do código: `Codigo/design-system/acessamob.css` (tokens) e
`Codigo/design-system/README.md` (uso). Este arquivo resume as decisões.

## Mundo visual

Aplicativo de trabalho (modo Operate), claro, para uso em casa e de dia. A marca entra por quatro
coisas: o **azul-escuro do menu** (`#0c2152`), que também veste os cartões de destaque; o **azul de
ação** (`#1d63dc`); a **Inter** com números tabulares nos horários; e a **régua do dia**, a
assinatura visual: o dia de 6h a 22h com cada cuidado marcado no seu horário e a agulha do "agora".
O círculo grosso e quase transparente atrás dos cartões de destaque vem do abraço do logo.

## Cores

| Papel | Token | Valor |
|---|---|---|
| Menu e destaque | `--marinho-800` | `#0c2152` |
| Ação | `--azul` / `--azul-forte` | `#1d63dc` / `#1650b8` |
| Fundo / superfície | `--fundo` / `--superficie` | `#f1f4fa` / `#ffffff` |
| Texto | `--tinta` / `--tinta-2` / `--tinta-3` | `#0b1a38` / `#3f4c66` / `#5d6a84` |
| Feito | `--verde` | `#12784a` |
| Atenção, recusa | `--ambar` / `--ambar-vivo` | `#8a5300` / `#f0a020` |
| Atraso, erro, ajuda | `--vermelho` | `#c42b23` |
| Tipos de cuidado | `--tipo-medicamento` `--tipo-consulta` `--tipo-exame` `--tipo-visita` `--tipo-tarefa` | violeta, azul, âmbar, verde, cinza-azulado |

Alto contraste troca os tokens em `:root.alto-contraste`.

## Tipografia

Inter. Escala em rem: 13 · 15 · **17 (base)** · 19 · 22 · 28 · 34 px. Pesos 400/500/600/700.
Horários e números com `font-variant-numeric: tabular-nums`. Letra maior: raiz a 118,75%;
textos e ícones crescem, espaços não, e os títulos crescem menos.

## Forma e espaço

Espaço em múltiplos de 4 px. Cantos: 10 · 14 · 20 · 28 px (cartões de destaque e folhas usam 28).
Sombras curtas com deslocamento (`--sombra-1/2/3`). Alvo de toque mínimo 48 px.

## Estrutura

Mobile-first. Celular: barra do topo azul-escura, conteúdo, abas embaixo (Início, Agenda,
Remédios, Tarefas, Mais). A partir de 64rem: menu lateral sem rolagem e tela presa à
janela: título e ações parados, só as listas rolam por dentro. Conteúdo de um mesmo assunto vira abas
em vez de página comprida (perfis, tarefas, cadastro). Diálogos viram folhas
que sobem no celular. Pontos de quebra: 40rem, 48rem, 64rem; no
computador, `@container palco` (46, 58, 64, 75 e 84rem).

## Componentes

`Shell`, `PaginaTopo`, `Estado`, `ReguaDoDia`, `Dialogo`, `Toast`; classes `.btn` (+ `-primario`,
`-suave`, `-perigo`, `-texto`, `-claro`, `-contorno`), `.btn-icone`, `.fab`, `.card`, `.campo`,
`.entrada`, `.busca`, `.pilula`, `.segmentado`, `.tag` (+ `--azul/verde/ambar/vermelho`),
`.interruptor`, `.estado`, `.esqueleto`.
