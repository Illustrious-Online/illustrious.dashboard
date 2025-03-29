import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";
import * as React from "react";
import { ColorModeProvider } from "./components/color-mode";
import { AuthProvider } from "./context/auth-context";
import { system } from "./theme";

export const Providers = ({ children }: { children: ReactNode }) => (
  <ChakraProvider value={system}>
    <ColorModeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ColorModeProvider>
  </ChakraProvider>
);
