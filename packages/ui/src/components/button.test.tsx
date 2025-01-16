import { ColorModeProvider } from "@chakra-ui/color-mode";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { cleanup, render, screen } from "@testing-library/react";
import React, { type ReactElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button component", () => {
  const renderWithButton = (ui: ReactElement) => {
    return render(
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>{ui}</ColorModeProvider>
      </ChakraProvider>,
    );
  };

  afterEach(() => {
    cleanup();
  });

  it("renders children correctly", () => {
    renderWithButton(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  it("disables the button when loading is true", () => {
    renderWithButton(
      <Button loading loadingText="Loading...">
        Click me
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveProperty("disabled", true);
  });

  it("displays spinner when loading is true and no loadingText is provided", () => {
    const { container } = renderWithButton(<Button loading>Click me</Button>);
    const spinnerElement = container.querySelector(".chakra-spinner");
    expect(spinnerElement).toBeDefined();
  });

  it("displays loadingText when loading is true and loadingText is provided", () => {
    renderWithButton(
      <Button loading loadingText="Loading...">
        Click me
      </Button>,
    );
    expect(screen.getByText("Loading...")).toBeDefined();
  });

  it("does not display spinner when loading is false", () => {
    const { container } = renderWithButton(<Button>Click me</Button>);
    const spinnerElement = container.querySelector(".chakra-spinner");
    expect(spinnerElement).toBeNull();
  });
});
