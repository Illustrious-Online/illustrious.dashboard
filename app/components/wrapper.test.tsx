import Wrapper from "@/components/wrapper";
import { ColorModeProvider } from "@chakra-ui/color-mode";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React, { type ReactElement } from "react";
import { afterEach, describe, expect, test } from "vitest";

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
  });

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
      screen.getByRole("button", { name: /Toggle color mode/i }),
    ).toBeDefined();
  });
});
