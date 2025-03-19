"use client";

import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";
import * as React from "react";
import { ColorModeProvider } from "./color-mode";
export const Provider = ({ children }: { children: ReactNode }) => (
  <ChakraProvider>
    <ColorModeProvider>{children}</ColorModeProvider>
  </ChakraProvider>
);
