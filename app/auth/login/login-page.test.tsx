import { ChakraProvider } from "@/providers/ChakraProvider";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LoginPage from "./page";

vi.mock("@/components/ui/wrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wrapper">{children}</div>
  ),
}));

vi.mock("./login-form", () => ({
  default: () => <div data-testid="login-form" />,
}));

const renderLoginPage = () => {
  render(
    <ChakraProvider>
      <LoginPage />
    </ChakraProvider>,
  );
};

describe("LoginPage", () => {
  it("renders the Wrapper component", () => {
    renderLoginPage();
    expect(screen.getByTestId("wrapper")).toBeInTheDocument();
  });

  it("renders the heading with correct text", () => {
    renderLoginPage();
    expect(
      screen.getByRole("heading", { name: /sign in to your account/i }),
    ).toBeInTheDocument();
  });

  it("renders the LoginForm component", () => {
    renderLoginPage();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
