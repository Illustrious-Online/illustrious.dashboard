import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
 
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    watch: false,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'sentry.*.ts',
        'instrumentation.ts',
        '.next', 
        'next.config.ts', 
        'vitest.config.mts',
        'next-env.d.ts',
        '__tests__'
      ],
    },
  },
})