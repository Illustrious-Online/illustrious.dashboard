import { expect, test, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import LinkSteam from '@/profile/steam/link/page';

// test('renders the Home component', () => {
//   const screen = render(
//     <ChakraProvider value={defaultSystem}>
//       <LinkSteam />
//     </ChakraProvider>
//   );
//   expect(screen.getByRole('heading', { level: 1, name: 'Hello World' })).toBeDefined()
// });

global.fetch = vi.fn();

test('renders the LinkSteam component', () => {
    render(
        <ChakraProvider value={defaultSystem}>
            <LinkSteam />
        </ChakraProvider>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Hello World' })).toBeDefined();
});

test('button click triggers fetch and redirects', async () => {
    render(
        <ChakraProvider value={defaultSystem}>
            <LinkSteam />
        </ChakraProvider>
    );

    const button = screen.getByRole('button', { name: 'Login with steam?' });
    fireEvent.click(button);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/link/steam', {
        method: 'POST',
        redirect: 'follow',
    }));

    await waitFor(() => expect(window.location.href).toBe('http://steam-auth-url.com'));
});

test('displays error message on fetch failure', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('An error occurred while sending the request.'));

    render(
        <ChakraProvider value={defaultSystem}>
            <LinkSteam />
        </ChakraProvider>
    );

    const button = screen.getByRole('button', { name: 'Login with steam?' });
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText('An error occurred while sending the request.')).toBeDefined());
});
