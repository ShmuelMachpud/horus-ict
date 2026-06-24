/// <reference types="vite/client">

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: { input: { main: path.resolve(__dirname, 'index.html') } },
    cssCodeSplit: true,
    target: 'modules',
  },
  define: {
    'import.meta.env': process.env,
  },
  server: {
    host: true,
    port: 3000,
    watch: { usePolling: true },
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', '@mui/material/Tooltip'],
    exclude: ['react-toastify'],
  },
});
