import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import React from "react";
import { describe, expect, it } from "vitest";
import {
  ColorModeButton,
  DarkMode,
  LightMode,
  useColorMode,
  useColorModeValue,
} from "./color-mode";

describe("ColorModeProvider", () => {
  it("renders without crashing", () => {
    render(
      <ThemeProvider attribute="class" enableSystem defaultTheme="system">
        <div>Test</div>
      </ThemeProvider>,
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

describe("useColorMode", () => {
  const TestComponent = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
      <div>
        <span data-testid="color-mode">{colorMode}</span>
        <button type="button" onClick={toggleColorMode}>
          Toggle
        </button>
      </div>
    );
  };

  it("toggles color mode", () => {
    render(
      <ThemeProvider attribute="class">
        <TestComponent />
      </ThemeProvider>,
    );

    const colorModeSpan = screen.getByTestId("color-mode");
    const toggleButton = screen.getByText("Toggle");

    expect(colorModeSpan.textContent).toBe("light"); // Default theme

    fireEvent.click(toggleButton);
    expect(colorModeSpan.textContent).toBe("dark");

    fireEvent.click(toggleButton);
    expect(colorModeSpan.textContent).toBe("light");
  });
});

describe("ColorModeButton", () => {
  it("renders and toggles color mode on click", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider attribute="class">
          <ColorModeButton />
        </ThemeProvider>
      </ChakraProvider>,
    );

    const button = screen.getByRole("button", { name: /toggle color mode/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    // Add assertions for toggling behavior if needed
  });
});

describe("useColorModeValue", () => {
  const TestComponent = ({ light, dark }: { light: string; dark: string }) => {
    const value = useColorModeValue(light, dark);
    return <span data-testid="color-mode-value">{value}</span>;
  };

  it("returns the light value when color mode is light", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <TestComponent light="Light Value" dark="Dark Value" />
      </ThemeProvider>,
    );

    const valueSpan = screen.getByTestId("color-mode-value");
    expect(valueSpan.textContent).toBe("Dark Value");
  });

  describe("LightMode", () => {
    it("renders correctly with provided props", () => {
      render(
        <ChakraProvider value={defaultSystem}>
          <LightMode data-testid="light-mode">Light Mode Content</LightMode>
        </ChakraProvider>,
      );

      const lightModeElement = screen.getByTestId("light-mode");
      expect(lightModeElement).toBeInTheDocument();
      expect(lightModeElement).toHaveTextContent("Light Mode Content");
      expect(lightModeElement).toHaveClass("chakra-theme light");
    });
  });

  describe("DarkMode", () => {
    it("renders correctly with provided props", () => {
      render(
        <ChakraProvider value={defaultSystem}>
          <DarkMode data-testid="dark-mode">Dark Mode Content</DarkMode>
        </ChakraProvider>,
      );

      const darkModeElement = screen.getByTestId("dark-mode");
      expect(darkModeElement).toBeInTheDocument();
      expect(darkModeElement).toHaveTextContent("Dark Mode Content");
      expect(darkModeElement).toHaveClass("chakra-theme dark");
    });
  });
});
