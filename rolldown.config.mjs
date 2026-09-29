import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'

export default defineConfig({
  input: 'src/index.ts',
  plugins: [dts({ emitDtsOnly: true })],
  output: {
    dir: 'dist',
    format: 'es',
    entryFileNames: '[name].mjs',
  },
})
