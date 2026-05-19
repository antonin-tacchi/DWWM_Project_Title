import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/auth':          { target: 'http://localhost:8080', changeOrigin: true },
      '/movies':        { target: 'http://localhost:8080', changeOrigin: true },
      '/tv':            { target: 'http://localhost:8080', changeOrigin: true },
      '/actors':        { target: 'http://localhost:8080', changeOrigin: true },
      '/ratings':       { target: 'http://localhost:8080', changeOrigin: true },
      '/comments':      { target: 'http://localhost:8080', changeOrigin: true },
      '/favorites':     { target: 'http://localhost:8080', changeOrigin: true },
      '/lists':         { target: 'http://localhost:8080', changeOrigin: true },
      '/notifications': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
});
