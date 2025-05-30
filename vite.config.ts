import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['stream', 'crypto'],
      output: {
        exports: 'named', // Use named exports to avoid the warning
      },
    },
  },
});
