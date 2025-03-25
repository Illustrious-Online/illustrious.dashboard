"use client";

import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";
import * as React from "react";
import { AuthProvider } from "../context/AuthContext";
import { system } from "../theme";
import { ColorModeProvider } from "./color-mode";

export const Provider = ({ children }: { children: ReactNode }) => (
  <ChakraProvider value={system}>
    <ColorModeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ColorModeProvider>
  </ChakraProvider>
);
