import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react';
import AuthPage from '../app/auth/AuthForm';

test('renders the Home component', () => {
  const screen = render(
    <ChakraProvider>
      <AuthPage />
    </ChakraProvider>
  );
  expect(screen.getByRole('heading', { level: 1, name: 'Hello World: Home' })).toBeDefined()
});