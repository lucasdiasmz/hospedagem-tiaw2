import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: './',
    server: {
        port: 5177,
        strictPort: true,
        proxy: {
            '/api': 'http://127.0.0.1:3005'
        }
    },
    preview: {
        proxy: {
            '/api': 'http://127.0.0.1:3005'
        }
    },
    build: {
        rollupOptions: {
            input: {
                principal: 'index.html',
                medicamentos: 'medicamentos.html'
            }
        }
    }
});
