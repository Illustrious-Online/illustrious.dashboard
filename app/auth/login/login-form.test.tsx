import { toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { ChakraProvider } from "@/providers/ChakraProvider";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "./login-form";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/components/ui/toaster", () => ({
  toaster: {
    create: vi.fn(),
  },
}));

const renderLoginForm = () => {
  return render(
    <ChakraProvider>
      <LoginForm />
    </ChakraProvider>,
  );
};

describe("LoginForm", () => {
  const mockSignIn = vi.fn();
  const mockSignInWithOAuth = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({
      signIn: mockSignIn,
      signInWithOAuth: mockSignInWithOAuth,
    });
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
    });
    vi.clearAllMocks();
  });

  it("renders the login form", () => {
    renderLoginForm();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/or sign in with/i)).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    renderLoginForm();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/email address/i));
    fireEvent.blur(screen.getByLabelText(/email address/i));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/password/i));
    fireEvent.blur(screen.getByLabelText(/password/i));

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("calls signIn with email and password on valid form submission", async () => {
    mockSignIn.mockResolvedValueOnce({ error: null });

    renderLoginForm();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    await waitFor(() => {
      expect(screen.getByText(/login/i)).toBeEnabled();
    });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("shows an error toast if signIn fails", async () => {
    mockSignIn.mockResolvedValueOnce({
      error: new Error("Invalid credentials"),
    });

    renderLoginForm();
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    await waitFor(() => {
      expect(screen.getByText(/login/i)).toBeEnabled();
    });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(toaster.create).toHaveBeenCalledWith({
        title: "Error",
        description: "Invalid credentials",
        type: "error",
        duration: 2500,
      });
    });
  });

  it("calls signInWithOAuth when OAuth button is clicked", async () => {
    renderLoginForm();
    fireEvent.click(screen.getByLabelText(/discord/i));

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith("discord");
    });
  });

  it("shows an error toast if signInWithOAuth fails", async () => {
    mockSignInWithOAuth.mockRejectedValueOnce(new Error("OAuth error"));

    renderLoginForm();
    fireEvent.click(screen.getByLabelText(/discord/i));

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
