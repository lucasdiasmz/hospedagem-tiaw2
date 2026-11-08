import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    /* 5174 para rodar junto com a homepage (5173) */
    port: 5174,
    /* em desenvolvimento, /api vai para o backend da agenda (server/) */
    proxy: { '/api': 'http://localhost:3002' },
  },
  preview: { port: 4174 },
});
