import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    ROUTINATOR_API_HOST: JSON.stringify(process.env.ROUTINATOR_API_HOST),
    ROTO_API_HOST: JSON.stringify(process.env.ROTO_API_HOST),
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://routinator.nlnetlabs.nl',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
