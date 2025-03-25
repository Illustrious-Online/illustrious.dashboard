import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthPage from "./page";

vi.mock("@/components/wrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wrapper">{children}</div>
  ),
}));

vi.mock("./LoginForm", () => ({
  default: () => <div data-testid="login-form" />,
}));

const renderPage = () => {
  render(
    <ChakraProvider value={defaultSystem}>
      <AuthPage />
    </ChakraProvider>,
  );
};

describe("AuthPage", () => {
  it("renders the Wrapper component", () => {
    renderPage();
    expect(screen.getByTestId("wrapper")).toBeInTheDocument();
  });

  it("renders the heading with correct text", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: /sign in to your account/i }),
    ).toBeInTheDocument();
  });

  it("renders the LoginForm component", () => {
    renderPage();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
