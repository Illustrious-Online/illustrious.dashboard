import { render, screen } from "@testing-library/react";
import RegisterPage from "./page";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@/providers/ChakraProvider";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/wrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wrapper">{children}</div>
  ),
}));

vi.mock("./RegistrationForm", () => ({
  default: () => <div data-testid="registration-form" />,
}));

const renderRegisterPage = () => {
  return render(
    <ChakraProvider>
      <RegisterPage />
    </ChakraProvider>,
  );
};

describe("RegisterPage", () => {
  it("renders the heading", () => {
    renderRegisterPage();
    const heading = screen.getByRole("heading", {
      name: /register a new account/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders the RegistrationForm component", () => {
    renderRegisterPage();
    const registrationForm = screen.getByTestId("registration-form");
    expect(registrationForm).toBeInTheDocument();
  });
});
