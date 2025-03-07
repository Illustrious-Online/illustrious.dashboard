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
      exclude: [
        '.next', 
        'next.config.ts', 
        'vitest.config.mts',
        'next-env.d.ts',
        '__tests__',
        'dist',
        'turbo/generators',
        '**/*.test.tsx',
        'sentry.*.config.ts',
        'app/global-error.tsx',
        'instrumentation.ts',
      ],
    },
  },
})