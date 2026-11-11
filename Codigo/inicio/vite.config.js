import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  /* em desenvolvimento, /api vai para o backend (server/) */
  server: {
    /* porta fixa: a agenda aponta para http://localhost:5173/ */
    port: 5173,
    strictPort: true,
    proxy: { '/api': 'http://localhost:3001' },
  },
});
