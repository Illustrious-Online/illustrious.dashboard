import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from '@/app/layout';

// Mock the layout component since it's async
vi.mock('@/app/layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-layout">{children}</div>
}));

// Mock the Provider component
vi.mock('@/app/components/provider', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-provider">{children}</div>
}));

test('Layout renders children correctly', () => {
  
  render(
    <RootLayout>
      <span>Test Child</span>
    </RootLayout>
  );
  
  expect(screen.getByText('Test Child')).toBeDefined();
});