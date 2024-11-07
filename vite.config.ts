import { defineConfig, PluginOption } from 'vite';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['node-fetch', 'form-data'],
      output: {
        exports: 'named', // Use named exports to avoid the warning
      },
      plugins: [
        nodeResolve({
          browser: true,
          preferBuiltins: false,
        }) as PluginOption,
        commonjs() as PluginOption,
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
          preventAssignment: true,
        }) as PluginOption,
      ],
    },
  },
});
