import { dts } from 'rollup-plugin-dts'

export default {
  input: 'src/index.ts',
  plugins: [dts()],
  output: ['dist/index.d.mts', 'dist/index.d.ts'].map(
    (file) => ({ file, format: 'es' }),
  ),
}
