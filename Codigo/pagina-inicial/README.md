# Página inicial

A porta de entrada pública do AcessaMob (raiz do site): apresenta o sistema e leva para o login ou o
cadastro, em `boas-vindas/`. Não usa API.

```
npm install
npm run dev        # http://localhost:5181
```

- `src/secoes/`: uma seção por arquivo, na ordem da página.
- `src/conteudo.js`: os textos. Os números da faixa são fatos do sistema (perfis, telas, ajustes de
  leitura); não há número de clientes nem depoimento, porque o projeto ainda não tem esses dados.
- `src/imagens/`: telas reais do sistema com dados de exemplo (`tela-*`), os objetos 3D renderizados
  para o projeto (`objeto-*`, `celular`) e a foto da seção "Sobre". A foto do topo fica em
  `design-system/assets`, porque a tela de boas-vindas também usa.
- Cores, fontes e formas vêm do `design-system/`.

Fotos: Muhammad Hicham (`hero-cuidador.webp`, fundo recortado e crachá desfocado) e Centre for Ageing
Better (`sobre-familia.webp`), no Unsplash, com a licença gratuita do site.
