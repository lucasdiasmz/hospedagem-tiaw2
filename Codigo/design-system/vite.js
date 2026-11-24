/* Configuração do Vite que liga uma tela ao design system (Codigo/design-system).
   Uso no vite.config.js de cada tela:
     import { comDesignSystem } from '../design-system/vite.js';
     export default defineConfig(comDesignSystem({ plugins: [react()], server: {...} }));
   - "@ds/..." aponta para esta pasta (ex.: import Shell from '@ds/Shell.jsx');
   - dedupe faz os componentes daqui usarem o React da própria tela;
   - fs.allow deixa o servidor de desenvolvimento ler arquivos de Codigo/, fora da pasta da tela. */
import { fileURLToPath } from 'node:url';

const pasta = fileURLToPath(new URL('.', import.meta.url));
/* Codigo/: o design system e o db.json global (algumas telas leem o db.json direto) */
const codigo = fileURLToPath(new URL('..', import.meta.url));

export function comDesignSystem(config = {}) {
  return {
    ...config,
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
