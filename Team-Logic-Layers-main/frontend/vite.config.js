import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy all / to backend OR just API paths:
      '/login': { target: 'http://localhost:8000', changeOrigin: true, secure: false },
      '/signup': { target: 'http://localhost:8000', changeOrigin: true, secure: false },
      '/upload': { target: 'http://localhost:8000', changeOrigin: true, secure: false },
      '/generate_template': { target: 'http://localhost:8000', changeOrigin: true, secure: false },
      '/generate': { target: 'http://localhost:8000', changeOrigin: true, secure: false },
      '/refine': { target: 'http://localhost:8000', changeOrigin: true, secure: false },
      '/download': { target: 'http://localhost:8000', changeOrigin: true, secure: false }
    }
  }
});
