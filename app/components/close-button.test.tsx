import { ColorModeProvider } from "@chakra-ui/color-mode";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { cleanup, render, screen } from "@testing-library/react";
import React, { type ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CloseButton } from "./close-button";

describe("CloseButton", () => {
  const renderCloseButton = (ui: ReactElement) => {
    return render(
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>{ui}</ColorModeProvider>
      </ChakraProvider>,
    );
  };

  afterEach(() => {
    cleanup();
  });

  it("renders without crashing", () => {
    renderCloseButton(<CloseButton />);
    expect(screen.getByLabelText("Close")).toBeDefined();
    expect(screen.getByLabelText("Close").querySelector("svg")).toBeDefined();
  });

  it("renders children when passed as props", () => {
    renderCloseButton(<CloseButton>Custom Content</CloseButton>);
    expect(screen.getByLabelText("Close")).toBeDefined();
    expect(screen.getByText("Custom Content")).toBeDefined();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    renderCloseButton(<CloseButton onClick={handleClick} />);
    const closeButton = screen.getByLabelText("Close") as HTMLInputElement;
    closeButton.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("forwards ref to the button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    renderCloseButton(<CloseButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
