import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  cacheDir: 'node_modules/.vite',
  server: {
    fs: {
      strict: true,
      allow: ['.'],
    },
  },
  optimizeDeps: {
    entries: ['index.html'],
    include: ['@vitejs/plugin-react', 'react', 'react-dom', 'framer-motion', 'lucide-react'],
  },
});
