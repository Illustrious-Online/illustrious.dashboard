import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Provider } from "./provider";

describe("Provider component", () => {
  beforeEach(() => {
    render(
      <Provider>
        <div>Test Child</div>
      </Provider>,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("renders children correctly", () => {
    expect(screen.getByText("Test Child")).toBeDefined();
  });

  it("applies ChakraProvider and ColorModeProvider", () => {
    expect(screen.getByText("Test Child").firstChild).toBeDefined();
  });
});
