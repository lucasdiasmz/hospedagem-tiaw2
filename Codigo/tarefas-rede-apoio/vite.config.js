import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  /* porta fixa: as outras telas apontam para http://localhost:5176/ (ver src/navegacao.js) */
  server: { port: 5176, strictPort: true },
});
