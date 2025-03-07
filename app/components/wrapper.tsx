"use client";

import { useColorMode } from "@chakra-ui/color-mode";
import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import * as React from "react";
import { ColorModeButton } from "./color-mode";

interface LayoutProps {
  children: ReactNode;
}

const Wrapper: FC<LayoutProps> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      {/* Top Bar Navigation */}
      <Flex
        as="nav"
        padding={4}
        bg={colorMode === "light" ? "teal.500" : "teal.700"}
        color="white"
        align="center"
      >
        <Heading size="lg">My App</Heading>
        <Spacer />
        <Text>HELLO WORLD</Text>
        <ColorModeButton />
      </Flex>

      {/* Page Content */}
      <Box as="main" flex="1" padding={4}>
        {children}
      </Box>
    </Box>
  );
};

export default Wrapper;
