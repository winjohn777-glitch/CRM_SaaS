import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/construction/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  sourcemap: true,
  external: ['@crm/types'],
});
