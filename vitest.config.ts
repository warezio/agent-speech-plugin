import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/types/index.ts',
        'src/cli.ts',
        'src/index.ts',
        'src/mcp-server.ts'
      ],
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
      all: true,
    },
    benchmark: {
      include: ['**/*.bench.ts'],
    },
  },
});
