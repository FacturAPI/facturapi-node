import { defineConfig, PluginOption } from 'vite';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['node-fetch', 'form-data'],
      plugins: [
        nodeResolve({
          browser: true,
          preferBuiltins: false,
        }) as PluginOption,
        commonjs() as PluginOption,
      ],
    },
  },
});
