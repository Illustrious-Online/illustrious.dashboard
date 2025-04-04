import { render, screen } from "@testing-library/react";
import LoginPage from "./page";
import { vi, describe, it, expect } from "vitest";

vi.mock("@/components/ui/wrapper", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="wrapper">{children}</div>
    ),
}));

vi.mock("./login-form", () => ({
    default: () => <div data-testid="login-form" />,
}));

describe("LoginPage", () => {
    it("renders the Wrapper component", () => {
        render(<LoginPage />);
        expect(screen.getByTestId("wrapper")).toBeInTheDocument();
    });

    it("renders the heading with correct text", () => {
        render(<LoginPage />);
        expect(
            screen.getByRole("heading", { name: /sign in to your account/i })
        ).toBeInTheDocument();
    });

    it("renders the LoginForm component", () => {
        render(<LoginPage />);
        expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });

    it("renders the Box with correct styles", () => {
        render(<LoginPage />);
        const box = screen.getByTestId("wrapper").firstChild;
        expect(box).toHaveStyle({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4",
        });
    });
});