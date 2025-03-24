import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Wrapper from "./wrapper";

describe("Wrapper Component", () => {
  it("renders without crashing", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Wrapper>
          <div>Test Content</div>
        </Wrapper>
      </ChakraProvider>,
    );

    expect(screen.getByText("Illustrious Dashboard")).toBeInTheDocument();
  });

  it("renders children inside the main content area", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Wrapper>
          <div>Test Content</div>
        </Wrapper>
      </ChakraProvider>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders the ColorModeButton component", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Wrapper>
          <div>Test Content</div>
        </Wrapper>
      </ChakraProvider>,
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
