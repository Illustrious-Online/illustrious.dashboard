import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import Home from '../app/page';

test('renders the Home component', () => {
  const screen = render(
    <ChakraProvider value={defaultSystem}>
      <Home />
    </ChakraProvider>
  );
  expect(screen.getByRole('heading', { level: 1, name: 'Hello World: Home' })).toBeDefined()
});