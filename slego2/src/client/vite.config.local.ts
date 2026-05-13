
import { defineConfig } from 'vite';
import baseConfig from './vite.config';

// This config is for local development with `pnpm run dev:local-hot`
// It extends the base client config and adds a proxy for the local API server.
export default defineConfig({
  ...baseConfig,
  server: {
    // The vite dev server will run on 5173 by default.
    // We proxy API calls to the local-server.js on port 3000.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});