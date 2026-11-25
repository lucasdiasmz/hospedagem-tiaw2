import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { comDesignSystem } from '../design-system/vite.js';

export default defineConfig(comDesignSystem({
  plugins: [react()],
  /* porta fixa: as outras telas apontam para http://localhost:5181/ (ver design-system/navegacao.js) */
  server: { port: 5181, strictPort: true },
}));
