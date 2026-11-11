import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: './',
    server: {
        port: 5178,
        strictPort: true,
        proxy: {
            '/api': 'http://127.0.0.1:3006'
        }
    },
    preview: {
        proxy: {
            '/api': 'http://127.0.0.1:3006'
        }
    },
    build: {
        rollupOptions: {
            input: {
                principal: 'index.html',
                perfil: 'perfil.html'
            }
        }
    }
});
