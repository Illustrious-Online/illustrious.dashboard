import React from 'react';
import { expect, test } from 'vitest'
import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import RootLayout from '@/app/layout';

test('RootLayout', () => {
    const screen = render(
      <ChakraProvider>
        <RootLayout>
          <span>Test Child</span>
        </RootLayout>
      </ChakraProvider>
    );
    expect(screen.getByText('Test Child')).toBeDefined();
});