import React from 'react';
import { expect, test } from 'vitest'
import { render } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import RootLayout from '@/layout';

test('RootLayout', () => {
    const screen = render(
      <ChakraProvider value={defaultSystem}>
        <RootLayout>
            <span>Test Child</span>
        </RootLayout>
      </ChakraProvider>
    );
    expect(screen.getByText('Test Child')).toBeDefined();
});