import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
 
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    watch: false,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    coverage: {
      exclude: [
        '.next', 
        'next.config.ts', 
        'vitest.config.mts',
        'next-env.d.ts',
        'dist',
        '**/*.test.tsx',
        'sentry.*.config.ts',
        'instrumentation.ts',
        'app/lib/supabase',
        'app/layout.tsx',
        'app/loader.tsx',
        'app/providers.tsx',
        'app/theme.ts',
      ],
    },
  },
})