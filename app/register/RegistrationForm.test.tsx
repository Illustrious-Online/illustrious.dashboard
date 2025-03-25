import { toaster } from "@/components/toaster";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import RegistrationForm from "@/register/RegistrationForm";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { createClient } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/components/toaster", () => ({
  toaster: {
    create: vi.fn(),
  },
}));

const renderRegistrationForm = () => {
  render(
    <ChakraProvider value={defaultSystem}>
      <RegistrationForm />
    </ChakraProvider>,
  );
};

describe("RegistrationForm", () => {
  const mockSignUp = vi.fn();
  const mockSignInWithOAuth = vi.fn();

  beforeEach(() => {
    (createClient as Mock).mockReturnValue({
      auth: {
        signUp: mockSignUp,
        signInWithOAuth: mockSignInWithOAuth,
      },
    });
  });

  it("renders the registration form", () => {
    renderRegistrationForm();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("validates input fields and displays errors", async () => {
    renderRegistrationForm();

    fireEvent.submit(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/password confirmation is required/i),
      ).toBeInTheDocument();
    });
  });

  it("submits form successfully", async () => {
    renderRegistrationForm();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "Password123!" },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /register/i })).toBeEnabled();
    });
    fireEvent.submit(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password123!",
        phone: "",
        options: expect.any(Object),
      });
    });
  });

  it("handles registration errors", async () => {
    mockSignUp.mockResolvedValueOnce({
      error: { message: "Sign-up failed" },
    });

    renderRegistrationForm();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "Password123!" },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /register/i })).toBeEnabled();
    });
    fireEvent.submit(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toaster.create).toHaveBeenCalledWith({
        title: "Error",
        description: "Sign-up failed",
        type: "error",
        duration: 2500,
      });
    });
  });

  it("calls handleOAuthSignIn when the Discord button is clicked", async () => {
    mockSignInWithOAuth.mockResolvedValueOnce({ error: null });

    renderRegistrationForm();

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

    renderRegistrationForm();

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
