'use client'

import {
  ChakraProvider as ChakraProviderBase,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#ffe8e0" },
          100: { value: "#ffcbb3" },
          200: { value: "#ffab80" },
          300: { value: "#ff8a4d" },
          400: { value: "#ff691a" },
          500: { value: "#e23d00" }, // Primary brand color
          600: { value: "#b43000" },
          700: { value: "#852300" },
          800: { value: "#561600" },
          900: { value: "#290800" },
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, customConfig);

export function ChakraProvider({ children }: { children: React.ReactNode }) {
  return <ChakraProviderBase value={system}>{children}</ChakraProviderBase>
}
