import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { comDesignSystem } from '../design-system/vite.js';

export default defineConfig(comDesignSystem({
  plugins: [react()],
  /* em desenvolvimento, /api vai para o backend (server/) */
  server: {
    /* porta fixa: as outras telas apontam para http://localhost:5173/ */
    port: 5173,
    strictPort: true,
    proxy: { '/api': 'http://localhost:3001' },
  },
}));
