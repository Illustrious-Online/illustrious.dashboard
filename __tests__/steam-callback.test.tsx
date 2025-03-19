import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react';
import SteamCallback from '@/app/profile/steam/callback/page';

test('renders the SteamCallback component', () => {
  const screen = render(
    <ChakraProvider>
      <SteamCallback />
    </ChakraProvider>
  );
  expect(screen.getByRole('heading', { level: 1, name: 'Hello World: Steam Callback' })).toBeDefined()
});