import { render, screen } from "@testing-library/react";
import RegisterPage from "./page";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

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
      <ChakraProvider value={defaultSystem}>
        <RegisterPage />
      </ChakraProvider>,
    );
  }

describe("RegisterPage", () => {
    it("renders the heading", () => {
        renderRegisterPage();
        const heading = screen.getByRole("heading", { name: /register a new account/i });
        expect(heading).toBeInTheDocument();
    });

    it("renders the RegistrationForm component", () => {
        renderRegisterPage();
        const registrationForm = screen.getByTestId("registration-form");
        expect(registrationForm).toBeInTheDocument();
    });
});