# Design

Fonte da verdade do código: `Codigo/design-system/acessamob.css` (tokens) e
`Codigo/design-system/README.md` (uso). Este arquivo resume as decisões.

## Mundo visual

Aplicativo de trabalho, claro, para uso em casa e de dia. A interface é quase toda neutra: fundo
cinza-claro, cartões brancos com uma linha fina e sem sombra. A cor aparece em quatro lugares: o **azul
de ação** (`#1d63dc`), um botão cheio por tela; o **marinho** (`#0c2152`), que marca o item escolhido
(abas, filtros, dia) e veste a única faixa da marca de cada tela; a **Inter** com números tabulares; e
a **régua do dia**, a assinatura visual. Regras que valem em todas as telas:

- no máximo duas caixas, uma dentro da outra; ícone solto, sem quadrado colorido em volta;
- nada se mexe sozinho: só resposta ao toque, ao ponteiro e ao foco (140 ms para entrar, 200 para sair);
- cartão que leva a outra tela sobe 2 px; botão sobe 1 px e afunda ao apertar;
- texto nunca menor que 13 px, sem caixa-alta; sem violeta.

## Cores

| Papel | Token | Valor |
|---|---|---|
| Escolhido e faixa da marca | `--selecao` (`--marinho-800`) | `#0c2152` |
| Ação | `--azul` / `--azul-forte` | `#1d63dc` / `#1650b8` |
| Fundo / superfície | `--fundo` / `--superficie` | `#f4f5f7` / `#ffffff` |
| Texto | `--tinta` / `--tinta-2` / `--tinta-3` | `#0e1729` / `#3b4560` / `#566078` |
| Feito | `--verde` | `#12784a` |
| Atenção, recusa | `--ambar` / `--ambar-vivo` | `#8a5300` / `#f0a020` |
| Atraso, erro, ajuda | `--vermelho` | `#c42b23` |
| Tipos de cuidado | `--tipo-medicamento` `--tipo-consulta` `--tipo-exame` `--tipo-visita` `--tipo-tarefa` | petróleo, azul, âmbar, verde, cinza-azulado |

Alto contraste troca os tokens em `:root.alto-contraste`.

## Tipografia

Inter. Escala em rem: 13 · 15 · **17 (base)** · 19 · 22 · 28 · 34 px. Pesos 400/500/600.
Horários e números com `font-variant-numeric: tabular-nums`. Letra maior: raiz a 118,75%;
textos e ícones crescem, espaços não, e os títulos crescem menos.

## Forma e espaço

Espaço em múltiplos de 4 px. Cantos: 8 (controles) · 12 (botões e painéis) · 20 px
(cartões e folhas). Sombra só em quem flutua ou sob o ponteiro (`--sombra-2/3`). Alvo de toque mínimo 48 px.

## Estrutura

Mobile-first. Celular: barra do topo branca, conteúdo, abas embaixo (Início, Agenda,
Remédios, Tarefas, Mais). A partir de 64rem: menu lateral claro, em três grupos (Rotina, Pessoa cuidada, Rede), sem rolagem, e tela presa à
janela: título e ações parados, só as listas rolam por dentro. Conteúdo de um mesmo assunto vira abas
em vez de página comprida (perfis, tarefas, cadastro). Diálogos viram folhas
que sobem no celular. Pontos de quebra: 40rem, 48rem, 64rem; no
computador, `@container palco` (46, 58, 64, 75 e 84rem).

## Componentes

`Shell`, `PaginaTopo`, `Estado`, `ReguaDoDia`, `Dialogo`, `Toast`; classes `.btn` (+ `-primario`,
`-suave`, `-perigo`, `-texto`, `-claro`, `-contorno`), `.btn-icone`, `.fab`, `.card`, `.campo`,
`.entrada`, `.busca`, `.pilula`, `.segmentado`, `.tag` (+ `--azul/verde/ambar/vermelho`),
`.interruptor`, `.estado`, `.esqueleto`.
