/* Configuração do Vite que liga uma tela ao design system (Codigo/design-system).
   Uso no vite.config.js de cada tela:
     import { comDesignSystem } from '../design-system/vite.js';
     export default defineConfig(comDesignSystem({ plugins: [react()], server: {...} }));
   - "@ds/..." aponta para esta pasta (ex.: import Shell from '@ds/Shell.jsx');
   - dedupe faz os componentes daqui usarem o React da própria tela;
   - fs.allow deixa o servidor de desenvolvimento ler arquivos de Codigo/, fora da pasta da tela;
   - todas as telas recebem o ícone da aba (o logo), as fontes e a descrição do site. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pasta = fileURLToPath(new URL('.', import.meta.url));
/* Codigo/: o design system e o db.json global (algumas telas leem o db.json direto) */
const codigo = fileURLToPath(new URL('..', import.meta.url));

const DESCRICAO = 'Cuidados, remédios, agenda e rede de apoio da pessoa idosa em um só lugar.';

const FONTES = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap';

function cabecalhoComum() {
  const logo = readFileSync(new URL('./assets/logo-acessamob.png', import.meta.url));
  let base = '/';
  return {
    name: 'acessamob-cabecalho',
    configResolved(c) { base = c.base; },
    configureServer(servidor) {
      servidor.middlewares.use('/favicon.png', (req, res) => res.setHeader('Content-Type', 'image/png').end(logo));
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'favicon.png', source: logo });
    },
    transformIndexHtml() {
      return [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'stylesheet', href: FONTES }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#f8f9f8' }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', href: base + 'favicon.png' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'description', content: DESCRICAO }, injectTo: 'head' },
      ];
    },
  };
}

export function comDesignSystem(config = {}) {
  return {
    ...config,
    plugins: [...(config.plugins || []), cabecalhoComum()],
    resolve: {
      ...(config.resolve || {}),
      alias: { ...(config.resolve?.alias || {}), '@ds': pasta },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      ...(config.server || {}),
      fs: { ...(config.server?.fs || {}), allow: ['.', codigo] },
    },
  };
}
