import { ColorModeProvider } from "@chakra-ui/color-mode";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { afterEach, describe, expect, test } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React, { type ReactElement} from "react";
import Wrapper from "@/wrapper";

describe("Wrapper component", () => {
  const renderWithProviders = (ui: ReactElement) => {
    return render(
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>{ui}</ColorModeProvider>
      </ChakraProvider>,
    );
  };

  afterEach(() => {
    cleanup();
  })

  test("renders children correctly", () => {
    renderWithProviders(
      <Wrapper>
        <div>Test Child</div>
      </Wrapper>,
    );
    expect(screen.getByText("Test Child")).toBeDefined();
  });

  test("renders top bar navigation with correct elements", () => {
    renderWithProviders(<Wrapper>Test</Wrapper>);
    expect(screen.getByText("My App")).toBeDefined();
    expect(screen.getByText("HELLO WORLD")).toBeDefined();
    expect(
      screen.getByRole("button", { name: /Dark Mode|Light Mode/i }),
    ).toBeDefined();
  });

  test("toggles color mode on button click", () => {
    renderWithProviders(<Wrapper>Test</Wrapper>);
    const toggleButton = screen.getByRole("button", {
      name: /Dark Mode|Light Mode/i,
    });

    // Initial state should be "Dark Mode"
    expect(toggleButton).toHaveProperty("textContent", "Dark Mode");

    // Click to toggle to "Light Mode"
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveProperty("textContent", "Light Mode");

    // Click to toggle back to "Dark Mode"
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveProperty("textContent", "Dark Mode");
  });
});
