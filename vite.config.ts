import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // Gated behind the `analyze` mode so normal `npm run build` is unaffected —
    // run via `npm run build:analyze` (`vite build --mode analyze`). Using
    // Vite's own `--mode` flag rather than a shell env var keeps this
    // cross-platform (this project is developed on Windows) without an
    // extra `cross-env` dependency.
    mode === 'analyze' && visualizer({ open: true, filename: 'dist/stats.html', gzipSize: true, brotliSize: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    rollupOptions: {
      output: {
        // Only `framer-motion` benefits from an explicit split — it's a large,
        // used-almost-everywhere dependency, but Vite's own route-level
        // `React.lazy` splitting means most pages don't need its animation
        // helpers on first paint. React/react-dom/react-router-dom, by
        // contrast, are needed synchronously by the entry point regardless,
        // so Rollup folds a forced split for them straight back into the
        // main chunk anyway — not worth the extra network request.
        manualChunks(id: string) {
          if (id.includes('node_modules') && id.includes('framer-motion')) return 'vendor-motion';
          return undefined;
        },
      },
    },
  },
}));
