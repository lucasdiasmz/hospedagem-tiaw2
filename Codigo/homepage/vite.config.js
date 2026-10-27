import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  /* em desenvolvimento, /api vai para o backend (server/) */
  server: {
    proxy: { '/api': 'http://localhost:3001' },
  },
});
