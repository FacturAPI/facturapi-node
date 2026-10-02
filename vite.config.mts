import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
    },
    rolldownOptions: {
      external: ['stream', 'crypto'],
      output: {
        exports: 'named', // Use named exports to avoid the warning
        footer: (chunk) =>
          chunk.fileName.endsWith('.cjs')
            ? 'module.exports = Object.defineProperties(exports.default, Object.getOwnPropertyDescriptors(exports));'
            : '',
      },
    },
  },
})
