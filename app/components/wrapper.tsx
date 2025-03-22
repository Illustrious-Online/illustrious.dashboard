"use client";

import { useColorMode } from "@chakra-ui/color-mode";
import { Box, Flex, Heading, Spacer } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import * as React from "react";
import { ColorModeButton } from "./color-mode";
import { Toaster } from "./toaster";

interface LayoutProps {
  children: ReactNode;
}

const Wrapper: FC<LayoutProps> = ({ children }) => {
  const { colorMode } = useColorMode();

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Toaster />
      <Flex
        as="nav"
        padding={4}
        bg={colorMode === "light" ? "teal.500" : "teal.700"}
        color="white"
        align="center"
      >
        <Heading size="lg">Illustrious Dashboard</Heading>
        <Spacer />
        <ColorModeButton />
      </Flex>

      <Box as="main" height="100%">
        {children}
      </Box>
    </Box>
  );
};

export default Wrapper;
