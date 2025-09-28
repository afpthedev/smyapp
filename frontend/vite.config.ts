import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
    allowedHosts: ['06acf4e434a0.ngrok-free.app'],
  },
  plugins: [react()],
});
