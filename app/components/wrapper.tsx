"use client";

import { Box, Flex, Heading, Spacer } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import * as React from "react";
import { ColorModeButton, useColorMode } from "./color-mode";
import { Toaster } from "./toaster";

interface LayoutProps {
  children: ReactNode;
}

const Wrapper: FC<LayoutProps> = ({ children }) => {
  const { colorMode } = useColorMode();

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Toaster />
      <Flex as="nav" padding={4} color="white" align="center">
        <Heading size="lg" color={"fg.muted"}>
          Illustrious Dashboard
        </Heading>
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
