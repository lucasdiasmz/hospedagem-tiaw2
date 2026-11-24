import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { comDesignSystem } from '../design-system/vite.js';

export default defineConfig(comDesignSystem({
  plugins: [react()],
  server: {
    /* 5174 para rodar junto com a homepage (5173) */
    port: 5174,
    /* porta fixa: a homepage aponta para http://localhost:5174/ */
    strictPort: true,
    /* em desenvolvimento, /api vai para o backend da agenda (server/) */
    proxy: { '/api': 'http://localhost:3002' },
  },
  preview: { port: 4174 },
}));
