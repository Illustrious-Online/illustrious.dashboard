import InputControl from "@/components/ui/input-control";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("InputControl Component", () => {
  const renderInputControl = (
    props: React.ComponentProps<typeof InputControl>,
  ) => {
    return render(
      <ChakraProvider value={defaultSystem}>
        <InputControl {...props} />
      </ChakraProvider>,
    );
  };

  it("renders the input field with the correct label", () => {
    renderInputControl({
      id: "test-input",
      name: "test",
      label: "Test Label",
      type: "text",
      required: true,
    });
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("calls handleChange when text input changes", () => {
    const handleChange = vi.fn();
    renderInputControl({
      id: "test-input",
      name: "test",
      label: "Test Label",
      type: "text",
      required: true,
      handleChange,
    });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("renders phone input when type is 'phone' and calls setFieldValue on change", () => {
    const setFieldValue = vi.fn();
    renderInputControl({
      id: "phone-input",
      name: "phone",
      label: "Phone Label",
      type: "phone",
      required: true,
      setFieldValue,
    });

    const phoneInput = screen.getByRole("textbox");
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    expect(setFieldValue).toHaveBeenCalledWith("phone", "1234567890");
  });

  it("displays an error message when there is an error", () => {
    renderInputControl({
      id: "test-input",
      name: "test",
      label: "Test Label",
      type: "text",
      required: true,
      touched: true,
      errors: "This field is required",
    });

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});
