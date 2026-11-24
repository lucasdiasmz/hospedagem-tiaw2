# Design system do AcessaMob

Pasta compartilhada por todas as telas. Antes, cada módulo tinha sua cópia do menu, dos ícones,
do aviso (toast), do diálogo, do `navegacao.js` e cerca de 1.200 linhas de CSS próprias. Agora
o que é comum mora aqui, e cada tela guarda só o que é dela.

## O que tem aqui

| Arquivo | Para quê |
|---|---|
| `acessamob.css` | Tokens (cores, tipografia, espaços, cantos), base, estrutura da tela e componentes: `.btn`, `.card`, `.campo`, `.pilula`, `.segmentado`, `.tag`, `.estado`, `.dialogo`, `.toast`, `.fab`, régua do dia. Mobile-first. |
| `Shell.jsx` | Estrutura de toda tela: barra do topo + abas de baixo no celular, menu lateral azul-escuro no computador (≥ 1024 px), folha "Mais" com as outras telas, atalhos e acessibilidade. |
| `Componentes.jsx` | `PaginaTopo` (título da tela), `Estado` (carregando / vazio / erro) e `ReguaDoDia`. |
| `Dialogo.jsx` | `<dialog>` nativo: folha que sobe no celular, centralizado no computador; Esc, foco preso, botão fechar. |
| `Toast.jsx` | Aviso rápido de confirmação ou erro. |
| `Icones.jsx` | Todos os ícones (grade 24, traço 1.8). |
| `navegacao.js` | Endereços das telas e das APIs (antes havia 8 cópias iguais). |
| `preferencias.js` | Letra maior, alto contraste e o perfil escolhido nas boas-vindas; valem em todas as telas. |
| `vite.js` | Liga uma tela a esta pasta (`@ds/...`). |

## Como uma tela usa

```js
// vite.config.js
import { comDesignSystem } from '../design-system/vite.js';
export default defineConfig(comDesignSystem({ plugins: [react()], server: { port: 5173 } }));

// main.jsx — nesta ordem
import '@ds/preferencias.js';
import '@ds/acessamob.css';
import './styles/minha-tela.css';

// App.jsx
import Shell from '@ds/Shell.jsx';
<Shell tela="agenda" usuario={usuario} atalhos={[{ rotulo: 'Novo', Icone: IconeMais, aoClicar }]}>
  <PaginaTopo titulo="Agenda" subtitulo="..." />
  ...
</Shell>
```

Ids de `tela`: `inicio`, `agenda`, `medicamentos`, `tarefas`, `linha-do-tempo`, `cuidadores`, `perfis`.

## Regras do visual

- **Identidade:** logo, nome, slogan "Mais cuidado, todos os dias.", azul `#1d63dc`, azul-escuro
  `#0c2152` no menu e nos cartões de destaque, fonte Inter. Não mude sem combinar com o grupo.
- **Mobile-first:** escreva o CSS para o celular e use `@media (min-width: ...)` para telas maiores
  (40rem tablet, 64rem computador, 72rem tela larga).
- **Toque:** nada clicável menor que 48 px (`var(--toque)`). O público inclui pessoas idosas.
- **Texto:** tudo em `rem`, para a opção "Letra maior" funcionar. Base de 17 px.
- **Cor só com função:** azul = ação, verde = feito, âmbar = atenção/recusa, vermelho = atraso,
  erro e pedido de ajuda. Cores por tipo de cuidado: `--tipo-medicamento`, `--tipo-consulta`...
- **Assinatura:** a régua do dia (`ReguaDoDia`) mostra o dia de 6h às 22h com cada cuidado no seu
  horário e a agulha do "agora". Usada no Início e em Medicamentos.
- Use os componentes daqui antes de criar um novo; se criar, use só os tokens (`var(--...)`).

## Hospedagem

O build único (`node Codigo/build-unificado.mjs`) já enxerga esta pasta. Num projeto da Vercel por
tela, mantenha marcada a opção *Include files outside of the Root Directory* (vem ligada por padrão).
