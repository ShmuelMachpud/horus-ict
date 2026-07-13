/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/client',
  server: {
    port: 3000,
    host: true,
    watch: { usePolling: true },
  },
  preview: {
    port: 3000,
    host: 'localhost',
  },
  plugins: [react(), tsconfigPaths(), nxViteTsPaths()], // ← tsconfigPaths נוסף
  define: {
    'import.meta.env': process.env, // ← נוסף מ-frontend (אם הקוד תלוי בזה)
  },
  optimizeDeps: {
    // ← נוסף מ-frontend
    include: ['@emotion/react', '@emotion/styled', '@mui/material/Tooltip'],
    exclude: ['react-toastify'],
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
