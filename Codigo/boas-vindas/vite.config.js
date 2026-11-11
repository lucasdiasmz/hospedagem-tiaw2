import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /* porta fixa: as outras telas apontam para http://localhost:5180/ (ver src/navegacao.js) */
  server: { port: 5180, strictPort: true },
})
