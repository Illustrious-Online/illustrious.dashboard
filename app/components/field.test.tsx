import { ColorModeProvider } from "@chakra-ui/color-mode";
import { Badge, ChakraProvider, Input, defaultSystem } from "@chakra-ui/react";
import { cleanup, render, screen } from "@testing-library/react";
import React, { type ReactElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Field } from "./field";

describe("Field component", () => {
  const renderField = (ui: ReactElement) => {
    return render(
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>{ui}</ColorModeProvider>
      </ChakraProvider>,
    );
  };

  afterEach(() => {
    cleanup();
  });

  it("renders the label when provided", () => {
    renderField(<Field label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeDefined();
  });

  it("renders the helper text when provided", () => {
    renderField(
      <Field helperText="Helper Text">
        <div>Child Element</div>
      </Field>,
    );
    expect(screen.getByText("Helper Text")).toBeDefined();
  });

  it("renders the error text when provided", () => {
    renderField(
      <Field invalid errorText="Error Text">
        <div>Child Element</div>
      </Field>,
    );
    expect(screen.getByText("Error Text")).toBeDefined();
  });

  it("renders the optional text when provided", () => {
    renderField(
      <Field
        label="Test Label"
        optionalText={
          <Badge size="xs" variant="surface">
            Optional
          </Badge>
        }
      >
        <Input placeholder="me@example.com" />
      </Field>,
    );
    expect(screen.getByText("Optional")).toBeDefined();
  });

  it("renders children correctly", () => {
    renderField(
      <Field>
        <div>Child Element</div>
      </Field>,
    );
    expect(screen.getByText("Child Element")).toBeDefined();
  });
});
