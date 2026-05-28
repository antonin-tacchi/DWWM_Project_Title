import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Returns '/index.html' for browser-navigation requests (Accept: text/html)
 * so Vite serves the React SPA instead of proxying to the backend.
 * XHR / fetch calls (Accept: application/json, or no text/html) are proxied normally.
 */
const spaBypass = (req) => {
  if (req.headers.accept?.includes('text/html')) return '/index.html';
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/auth':          { target: 'http://localhost:8080', changeOrigin: true, bypass: spaBypass },
      '/admin':         { target: 'http://localhost:8080', changeOrigin: true, bypass: spaBypass },
      '/movies':        { target: 'http://localhost:8080', changeOrigin: true, bypass: spaBypass },
      '/tv':            { target: 'http://localhost:8080', changeOrigin: true, bypass: spaBypass },
      '/actors':        { target: 'http://localhost:8080', changeOrigin: true, bypass: spaBypass },
      '/ratings':       { target: 'http://localhost:8080', changeOrigin: true, bypass: spaBypass },
      '/comments':      { target: 'http://localhost:8080', changeOrigin: true, bypass: spaBypass },
      '/favorites':     { target: 'http://localhost:8080', changeOrigin: true, bypass: spaBypass },
      '/lists':         { target: 'http://localhost:8080', changeOrigin: true, bypass: spaBypass },
      '/notifications': { target: 'http://localhost:8080', changeOrigin: true, bypass: spaBypass },
    },
  },
});
