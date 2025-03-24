import { toaster } from "@/app/components/toaster";
import { createClient } from "@/lib/supabase/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import LoginForm from "./LoginForm";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/app/components/toaster", () => ({
  toaster: {
    create: vi.fn(),
  },
}));

const renderLoginForm = () => {
  render(
    <ChakraProvider value={defaultSystem}>
      <LoginForm />
    </ChakraProvider>,
  );
};

describe("LoginForm", () => {
  const mockSignInWithPassword = vi.fn();
  const mockSignInWithOAuth = vi.fn();

  beforeEach(() => {
    (createClient as Mock).mockReturnValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signInWithOAuth: mockSignInWithOAuth,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with email and password fields", () => {
    renderLoginForm();
    expect(
      screen.getByPlaceholderText("Enter your email address"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("validates email and password fields", async () => {
    renderLoginForm();
    fireEvent.click(screen.getByPlaceholderText("Enter your email address"));
    fireEvent.blur(screen.getByPlaceholderText("Enter your email address"));
    expect(await screen.findByText("Email is required")).toBeInTheDocument();

    fireEvent.click(screen.getByPlaceholderText("Enter your password"));
    fireEvent.blur(screen.getByPlaceholderText("Enter your password"));
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  it("shows error for invalid email format", async () => {
    renderLoginForm();
    fireEvent.change(screen.getByPlaceholderText("Enter your email address"), {
      target: { value: "invalid-email" },
    });
    fireEvent.blur(screen.getByPlaceholderText("Enter your email address"));

    expect(
      await screen.findByText("Invalid email address"),
    ).toBeInTheDocument();
  });

  it("shows error for invalid password format", async () => {
    renderLoginForm();
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password" },
    });
    fireEvent.blur(screen.getByPlaceholderText("Enter your password"));

    expect(
      await screen.findByText(
        "Password must contain at least one uppercase letter",
      ),
    ).toBeInTheDocument();
  });

  it("submits the form with valid credentials", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    renderLoginForm();
    fireEvent.change(screen.getByPlaceholderText("Enter your email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "Password1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password1!",
      });
    });
  });

  it("shows an error when email authentication fails", async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: new Error("Invalid credentials"),
    });

    renderLoginForm();
    fireEvent.change(screen.getByPlaceholderText("Enter your email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "Password1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toaster.create).toHaveBeenCalledWith({
        title: "Error",
        description: "Invalid credentials",
        type: "error",
        duration: 2500,
      });
    });
  });

  it("handles OAuth sign-in with Discord", async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null });

    renderLoginForm();
    fireEvent.click(screen.getByLabelText("Discord"));

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: "discord",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
        },
      });
    });
  });

  it("shows an error when OAuth sign-in fails", async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: new Error("OAuth error") });

    renderLoginForm();
    fireEvent.click(screen.getByLabelText("Discord"));

    await waitFor(() => {
      expect(toaster.create).toHaveBeenCalledWith({
        title: "Error",
        description: "OAuth error",
        type: "error",
        duration: 2500,
      });
    });
  });
});
