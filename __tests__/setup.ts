import '@testing-library/jest-dom';

// Setup environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';


// Mock console error/warn for cleaner test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Suppress specific errors in tests
  if (
    typeof args[0] === 'string' &&
    (
      args[0].includes('Warning:') ||
      args[0].includes('ReactDOM.render is no longer supported')
    )
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  // Suppress specific warnings in tests
  if (
    typeof args[0] === 'string' &&
    (
      args[0].includes('Warning:') ||
      args[0].includes('Provider not found')
    )
  ) {
    return;
  }
  originalConsoleWarn(...args);
}; 