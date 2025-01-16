import { beforeEach, afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import LinkSteam from '@/profile/steam/link/page';

global.fetch = vi.fn().mockResolvedValueOnce(() => {
    Promise.resolve({
        json: () => Promise.resolve({ url: 'http://steam-auth-url.com' }),
    })
});
    
beforeEach(() => {
  render(
    <ChakraProvider value={defaultSystem}>
      <LinkSteam />
    </ChakraProvider>
  );
});

afterEach(() => {
  cleanup();
})

test('renders the LinkSteam component', () => {
  expect(screen.getByRole('heading', { level: 1, name: 'Hello World: Link Steam' })).toBeDefined();
});

test('button click triggers fetch and redirects', async () => {
  const button = screen.getByRole('button', { name: 'Login with steam' });
  fireEvent.click(button);

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/link/steam', {
    method: 'POST',
    redirect: 'follow',
  }));
});

test('displays error message on fetch failure', async () => {
  global.fetch = vi.fn().mockRejectedValueOnce(new Error('An error occurred while sending the request.'));

  const button = screen.getByRole('button', { name: 'Login with steam' });
  fireEvent.click(button);

  await waitFor(() => expect(screen.getByText('An error occurred while sending the request.')).toBeDefined());
});
