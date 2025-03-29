import { toaster } from "@/components/toaster";
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
import LoginForm from "./login-form";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/components/toaster", () => ({
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

  it("renders the form with email and password inputs", () => {
    renderLoginForm();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("validates form inputs and shows errors", async () => {
    renderLoginForm();

    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
    fireEvent.click(screen.getByLabelText(/email address/i));
    fireEvent.blur(screen.getByLabelText(/email address/i));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/password/i));
    fireEvent.blur(screen.getByLabelText(/password/i));
    expect(
      await screen.findByText(/password is required/i),
    ).toBeInTheDocument();
  });

  it("calls handleEmailAuth on form submission with valid inputs", async () => {
    mockSignInWithPassword.mockResolvedValueOnce({ error: null });

    renderLoginForm();

    fireEvent.change(screen.getByRole("textbox", { name: /email address/i }), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /login/i })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows an error toast if email authentication fails", async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      error: { message: "Invalid credentials" },
    });

    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /login/i })).toBeEnabled();
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

  it("calls handleOAuthSignIn when the Discord button is clicked", async () => {
    mockSignInWithOAuth.mockResolvedValueOnce({ error: null });

    renderLoginForm();

    fireEvent.click(screen.getByRole("button", { name: /discord/i }));

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: "discord",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
        },
      });
    });
  });

  it("shows an error toast if OAuth authentication fails", async () => {
    mockSignInWithOAuth.mockResolvedValueOnce({
      error: { message: "OAuth error" },
    });

    renderLoginForm();

    fireEvent.click(screen.getByRole("button", { name: /discord/i }));

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
