import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { comDesignSystem } from "../../design-system/vite.js";

export default defineConfig(comDesignSystem({
  plugins: [react()],
  server: {
    /* porta fixa: as outras telas apontam para http://localhost:5179/ (ver design-system/navegacao.js) */
    port: 5179,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:3007"
    }
  }
}));
