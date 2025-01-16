import { ColorModeProvider } from "@chakra-ui/color-mode";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { cleanup } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import React, { type ReactElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";
import type { CheckboxProps } from "./checkbox";

describe("Checkbox component", () => {
  const defaultProps: CheckboxProps = {
    inputProps: { "aria-label": "checkbox" },
    rootRef: React.createRef<HTMLLabelElement>(),
  };

  const renderCheckbox = (ui: ReactElement) => {
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
    renderCheckbox(<Checkbox {...defaultProps} />);
    expect(screen.getByLabelText("checkbox")).toBeDefined();
  });

  it("renders custom icon when provided", () => {
    const iconProps = {
      ...defaultProps,
      icon: <span data-testid="custom-icon" />,
    };
    renderCheckbox(<Checkbox {...iconProps} />);
    expect(screen.getByTestId("custom-icon")).toBeDefined();
  });

  it("renders children correctly", () => {
    renderCheckbox(<Checkbox {...defaultProps}>Label Text</Checkbox>);
    expect(screen.getByText("Label Text")).toBeDefined();
  });

  it("forwards refs correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    renderCheckbox(<Checkbox {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("renders default indicator when no icon is provided", () => {
    renderCheckbox(<Checkbox inputProps={{ "aria-label": "checkbox" }} />);
    const indicator = screen
      .getByRole("checkbox")
      .parentElement?.querySelector(
        '[data-testid="chakra-checkbox-indicator"]',
      );
    expect(indicator).toBeDefined();
  });

  it("handles input props correctly", () => {
    renderCheckbox(
      <Checkbox
        {...defaultProps}
        inputProps={{ "aria-label": "test-checkbox" }}
      />,
    );
    expect(screen.getByLabelText("test-checkbox")).toBeDefined();
  });

  it("toggles checkbox state on click", () => {
    renderCheckbox(<Checkbox {...defaultProps} />);
    const checkbox = screen.getByLabelText("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    checkbox.click();
    expect(checkbox.checked).toBe(true);
  });
});
