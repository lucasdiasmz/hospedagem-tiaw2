import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { comDesignSystem } from '../design-system/vite.js';

export default defineConfig(comDesignSystem({
  plugins: [react()],
  /* porta fixa: as outras telas apontam para http://localhost:5175/ (ver design-system/navegacao.js) */
  server: { port: 5175, strictPort: true },
}));
