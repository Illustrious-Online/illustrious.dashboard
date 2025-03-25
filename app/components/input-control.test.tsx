import { fireEvent, render, screen } from "@testing-library/react";
import InputControl from "./input-control";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";

describe("InputControl Component", () => {
  it("renders the input field with the correct label", () => {
    render(
      <InputControl
        id="test-input"
        name="test"
        label="Test Label"
        type="text"
        required={true}
        placeholder="Enter text"
        value=""
        handleChange={() => {}}
        handleBlur={() => {}}
        touched={false}
        errors=""
      />,
    );

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("renders the phone input when type is 'phone'", () => {
    render(
      <InputControl
        id="phone-input"
        name="phone"
        label="Phone Number"
        type="phone"
        required={true}
        value=""
        setFieldValue={() => {}}
        setFieldTouched={() => {}}
        touched={false}
        errors=""
      />,
    );

    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "tel");
  });

  it("displays an error message when there are validation errors", () => {
    render(
      <InputControl
        id="error-input"
        name="error"
        label="Error Input"
        type="text"
        required={true}
        value=""
        handleChange={() => {}}
        handleBlur={() => {}}
        touched={true}
        errors="This field is required"
      />,
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("calls handleChange when input value changes", () => {
    const handleChange = vi.fn();
    render(
      <InputControl
        id="change-input"
        name="change"
        label="Change Input"
        type="text"
        required={true}
        value=""
        handleChange={handleChange}
        handleBlur={() => {}}
        touched={false}
        errors=""
      />,
    );

    const input = screen.getByLabelText("Change Input");
    fireEvent.change(input, { target: { value: "New Value" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("calls handleBlur when input loses focus", () => {
    const handleBlur = vi.fn();
    render(
      <InputControl
        id="blur-input"
        name="blur"
        label="Blur Input"
        type="text"
        required={true}
        value=""
        handleChange={() => {}}
        handleBlur={handleBlur}
        touched={false}
        errors=""
      />,
    );

    const input = screen.getByLabelText("Blur Input");
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalled();
  });

  it("calls setFieldValue and setFieldTouched for phone input", () => {
    const setFieldValue = vi.fn();
    const setFieldTouched = vi.fn();
    render(
      <InputControl
        id="phone-input"
        name="phone"
        label="Phone Number"
        type="phone"
        required={true}
        value=""
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
        touched={false}
        errors=""
      />,
    );

    const phoneInput = screen.getByRole("textbox");
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.blur(phoneInput);

    expect(setFieldValue).toHaveBeenCalledWith("phone", "1234567890");
    expect(setFieldTouched).toHaveBeenCalledWith("phone", true);
  });
});
