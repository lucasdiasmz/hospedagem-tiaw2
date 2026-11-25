import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { comDesignSystem } from '../design-system/vite.js';

export default defineConfig(comDesignSystem({
  plugins: [react()],
  /* porta fixa: as outras telas apontam para http://localhost:5180/ (ver design-system/navegacao.js) */
  server: { port: 5180, strictPort: true, proxy: { '/api': 'http://localhost:3001' } },
}));
