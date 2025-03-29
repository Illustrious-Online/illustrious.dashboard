import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e3f9f4" },
          100: { value: "#c1f0e4" },
          200: { value: "#9ee6d4" },
          300: { value: "#79dcc3" },
          400: { value: "#54d2b3" },
          500: { value: "#1ab197" }, // Primary brand color
          600: { value: "#179f88" },
          700: { value: "#12806e" },
          800: { value: "#0d6254" },
          900: { value: "#084539" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
