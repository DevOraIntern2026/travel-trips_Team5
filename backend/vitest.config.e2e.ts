import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // .kilo holds tool worktree checkouts (possibly stale); never test them.
    exclude: ['**/node_modules/**', '**/dist/**', '**/.kilo/**'],
    // E2E files share one database: run them serially so per-test cleanup
    // in one file never races seeds or count assertions in another.
    fileParallelism: false,
    // Real argon2 hashing makes auth setup take seconds per test.
    testTimeout: 30000,
  },
});
