import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/esewa-api': {
        target: 'https://esewa.com.np/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/esewa-api/, ''),
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      '/esewa-merchant-api': {
        target: 'https://merchant.esewa.com.np/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/esewa-merchant-api/, ''),
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      '/esewa-developer-api': {
        target: 'https://developer.esewa.com.np/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/esewa-developer-api/, ''),
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    }
  }
});