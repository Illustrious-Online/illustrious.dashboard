import { ColorModeProvider } from "@chakra-ui/color-mode";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { cleanup, render } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InputGroup, type InputGroupProps } from "./input-group";

describe("InputGroup", () => {
  const renderComponent = (props: Partial<InputGroupProps> = {}) => {
    return render(
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>
          <InputGroup {...props}>
            <input />
          </InputGroup>
        </ColorModeProvider>
      </ChakraProvider>,
    );
  };

  afterEach(() => {
    cleanup();
  });

  it("should render without crashing", () => {
    const { container } = renderComponent();
    expect(container).toBeDefined();
  });

  it("should render startElement when provided", () => {
    const startElement = <span>Start</span>;
    const { getByText } = renderComponent({ startElement });
    expect(getByText("Start")).toBeDefined();
  });

  it("should render endElement when provided", () => {
    const endElement = <span>End</span>;
    const { getByText } = renderComponent({ endElement });
    expect(getByText("End")).toBeDefined();
  });
});
