"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import type React from "react";
import { ColorModeProvider } from "./components/color-mode";

export const Provider = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    <ColorModeProvider>{children}</ColorModeProvider>
  </ChakraProvider>
);
