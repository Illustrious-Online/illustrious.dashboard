'use client';

import { ColorModeButton } from "@/components/color-mode"
import { Box, Flex, Heading, Spacer, Button, Text } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<LayoutProps> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      {/* Top Bar Navigation */}
      <Flex
        as="nav"
        padding={4}
        bg={colorMode === 'light' ? 'teal.500' : 'teal.700'}
        color="white"
        align="center"
      >
        <Heading size="lg">My App</Heading>
        <Spacer />
        <Text>
          HELLO WORLD
        </Text>
        <ColorModeButton />

        {/* Dark Mode Toggle Button */}
        <Button onClick={toggleColorMode} variant="outline" colorScheme={colorMode === 'light' ? 'blue' : 'yellow'}>
          {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>
      </Flex>

      {/* Page Content */}
      <Box as="main" flex="1" padding={4}>
        {children}
      </Box>
    </Box>
  );
};

export default Wrapper;