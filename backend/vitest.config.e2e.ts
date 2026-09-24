import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // E2E files share one database: run them serially so per-test cleanup
    // in one file never races seeds or count assertions in another.
    fileParallelism: false,
  },
});
