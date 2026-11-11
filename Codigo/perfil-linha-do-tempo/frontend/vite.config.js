import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    /* porta fixa: as outras telas apontam para http://localhost:5179/ (ver src/navegacao.js) */
    port: 5179,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:3007"
    }
  }
});
