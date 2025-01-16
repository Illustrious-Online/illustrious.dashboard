import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import LinkSteam from '@/profile/steam/link/page';

test('renders the Home component', () => {
  const screen = render(
    <ChakraProvider value={defaultSystem}>
      <LinkSteam />
    </ChakraProvider>
  );
  expect(screen.getByRole('heading', { level: 1, name: 'Hello World' })).toBeDefined()
});