import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import SteamCallback from '@/profile/steam/callback/page';

test('renders the SteamCallback component', () => {
  const screen = render(
    <ChakraProvider value={defaultSystem}>
      <SteamCallback />
    </ChakraProvider>
  );
  expect(screen.getByRole('heading', { level: 1, name: 'Hello World: Steam Callback' })).toBeDefined()
});