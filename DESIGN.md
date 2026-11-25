# Design

Fonte da verdade do código: `Codigo/design-system/acessamob.css` (tokens) e
`Codigo/design-system/README.md` (uso). Este arquivo resume as decisões.

## Mundo visual

Claro, arejado e de confiança, para uso em casa e de dia. Fundo quase branco, verde-mata profundo na
ação e na marca, menta como apoio, cartões de cantos amplos sem sombra em repouso. Duas aplicações:

- **Página inicial** (raiz do site): apresenta o sistema. Títulos grandes, foto recortada sobre forma
  orgânica, objetos 3D, selos flutuantes e fundos suaves por bloco. Sete seções: topo, hero, recursos,
  sobre, números, por que usar e chamada final.
- **Telas de dentro**: as mesmas cores, fontes e formas, com mais densidade e menos enfeite. A
  assinatura é a **régua do dia**.

Regras que valem em todas as telas:

- um botão cheio por tela; botões em pílula; item escolhido em `--selecao` (verde-mata cheio);
- no máximo duas caixas, uma dentro da outra;
- resposta ao toque, ao ponteiro e ao foco em 140 a 260 ms; na página inicial há um movimento de
  chegada, e a demonstração passa sozinha só quando a pessoa aperta o play;
- cartão que leva a outro lugar sobe 2 ou 3 px; a seta do botão anda 4 px; botão afunda ao apertar;
- texto nunca menor que 13 px, sem caixa-alta; sem violeta;
- nenhum número de clientes, depoimento ou parceiro: só fatos do sistema.

## Cores

| Papel | Token | Valor |
|---|---|---|
| Escolhido e faixa da marca | `--selecao` (`--mata-800`) | `#113c34` |
| Ação | `--acao` / `--acao-forte` | `#16463d` / `#0e332c` |
| Apoio | `--acao-suave` / `--folha-clara` / `--folha` | `#e5ece9` / `#cfe3d8` / `#6fae93` |
| Destaque em título | `.realce` (página inicial) | `#1c7a58` |
| Blocos suaves | `--tom-menta` `--tom-nevoa` `--tom-salvia` `--tom-areia` | `#e1eee7` `#e8eff1` `#edf2e6` `#f6f0e4` |
| Fundo / fundo do hero / superfície | `--fundo` / `--fundo-2` / `--superficie` | `#f8f9f8` / `#f3f5f4` / `#ffffff` |
| Texto | `--tinta` / `--tinta-2` / `--tinta-3` | `#142420` / `#40504b` / `#5a6965` |
| Feito | `--verde` | `#12784a` |
| Atenção, recusa | `--ambar` / `--ambar-vivo` | `#8a5300` / `#eaa33a` |
| Atraso, erro, ajuda | `--vermelho` | `#bf2f27` |
| Tipos de cuidado | `--tipo-medicamento` `--tipo-consulta` `--tipo-exame` `--tipo-visita` `--tipo-tarefa` | petróleo, azul, âmbar, verde-oliva, cinza-verde |

Alto contraste troca os tokens em `:root.alto-contraste`.

## Tipografia

Plus Jakarta Sans nos títulos (600 a 800), Inter no resto; Caveat só na frase manuscrita da página
inicial. As fontes entram por `design-system/vite.js`. Escala em rem: 13 · 15 · **17 (base)** · 19 · 22 · 28 · 34 px. Pesos 400/500/600.
Horários e números com `font-variant-numeric: tabular-nums`. Letra maior: raiz a 118,75%;
textos e ícones crescem, espaços não, e os títulos crescem menos.

## Forma e espaço

Espaço em múltiplos de 4 px. Cantos: 10 (campos) · 14 (painéis) · 22 a 24 px
(cartões, fotos e folhas) · pílula (botões, menu, abas). Sombra só em quem flutua ou sob o ponteiro (`--sombra-2/3`). Alvo de toque mínimo 48 px.

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
`.entrada`, `.busca`, `.pilula`, `.segmentado`, `.tag` (+ `--destaque/verde/ambar/vermelho`),
`.interruptor`, `.estado`, `.esqueleto`.
