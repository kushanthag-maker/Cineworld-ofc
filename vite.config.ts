import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { app } from './server';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'express-plugin',
      configureServer(server) {
        server.middlewares.use(app);
      }
    }
  ],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
