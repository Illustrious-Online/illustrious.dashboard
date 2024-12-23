'use client';

import { ColorModeProvider } from "@/components/ui/color-mode"
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import React from 'react';

export const Provider = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    <ColorModeProvider>{children}</ColorModeProvider>
  </ChakraProvider>
);