import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
/// <reference types="node" />
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file for the current mode
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_BASE_URL; // <-- use this, not import.meta.env

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
            editor: ['@ckeditor/ckeditor5-build-classic', '@ckeditor/ckeditor5-react'],
            docs: ['jspdf', 'jspdf-autotable', 'xlsx', 'qrcode', 'html-to-image'],
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});