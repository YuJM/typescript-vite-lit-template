import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        ...configDefaults.coverage.exclude!,
        '**/node_modules/**',
        '**/dist/**',
        '**/*.config.{js,ts}',
        '**/public/**',
        '**/tests/setup/**',
        '**/tests/fixtures/**',
        '**/tests/mocks/**',
        '**/tests/utils/**'
      ],
      include: ['src/**/*.{js,ts}'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    include: [
      'src/**/*.{test,spec}.{js,ts}',
      'tests/unit/**/*.{test,spec}.{js,ts}',
      'tests/integration/**/*.{test,spec}.{js,ts}'
    ],
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      'tests/e2e/**',
      'tests/fixtures/**',
      'tests/mocks/**',
      'tests/setup/**',
      'tests/utils/**'
    ],
    testTimeout: 10000,
    hookTimeout: 10000,
    reporters: ['verbose', 'json', 'html']
  }
});