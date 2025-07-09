import { toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { ChakraProvider } from "@/providers/ChakraProvider";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import RegistrationForm from "./registration-form";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/components/ui/toaster", () => ({
  toaster: {
    create: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

const renderRegistrationForm = () => {
  return render(
    <ChakraProvider>
      <RegistrationForm />
    </ChakraProvider>,
  );
};

describe("RegistrationForm", () => {
  const mockSignUp = vi.fn();
  const mockSignInWithOAuth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({
      signUp: mockSignUp,
      signInWithOAuth: mockSignInWithOAuth,
    });
  });

  it("renders the registration form", async () => {
    renderRegistrationForm();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i }),
    ).toBeInTheDocument();
  });

  it("validates form inputs and shows errors", async () => {
    renderRegistrationForm();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/email address/i));
    fireEvent.blur(screen.getByLabelText(/email address/i));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/^password/i));
    fireEvent.blur(screen.getByLabelText(/^password/i));

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/confirm password/i));
    fireEvent.blur(screen.getByLabelText(/confirm password/i));

    await waitFor(() => {
      expect(
        screen.getByText(/password confirmation is required/i),
      ).toBeInTheDocument();
    });
  });

  it("submits the form successfully", async () => {
    mockSignUp.mockResolvedValueOnce({ error: null });

    renderRegistrationForm();
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "1234567890" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        "test@example.com",
        "Password1!",
        "1234567890",
      );
    });
  });

  // it("shows an error when registration fails", async () => {
  //   mockSignUp.mockRejectedValueOnce(new Error("Registration failed"));

  //   renderRegistrationForm();
  //   fireEvent.change(screen.getByLabelText(/email address/i), {
  //     target: { value: "test@example.com" },
  //   });
  //   fireEvent.change(screen.getByLabelText(/password/i), {
  //     target: { value: "Password1!" },
  //   });
  //   fireEvent.change(screen.getByLabelText(/confirm password/i), {
  //     target: { value: "Password1!" },
  //   });

  //   fireEvent.click(screen.getByRole("button", { name: /register/i }));

  //   await waitFor(() => {
  //     expect(toaster.create).toHaveBeenCalledWith({
  //       title: "Error",
  //       description: "Registration failed",
  //       type: "error",
  //       duration: 2500,
  //     });
  //   });
  // });

  // it("handles OAuth sign-in", async () => {
  //   renderRegistrationForm();
  //   fireEvent.click(screen.getByLabelText(/discord/i));

  //   await waitFor(() => {
  //     expect(mockSignInWithOAuth).toHaveBeenCalledWith("discord");
  //   });
  // });

  // it("shows an error when OAuth sign-in fails", async () => {
  //   mockSignInWithOAuth.mockRejectedValueOnce(new Error("OAuth error"));

  //   renderRegistrationForm();
  //   fireEvent.click(screen.getByLabelText(/discord/i));

  //   await waitFor(() => {
  //     expect(toaster.create).toHaveBeenCalledWith({
  //       title: "Error",
  //       description: "OAuth error",
  //       type: "error",
  //       duration: 2500,
  //     });
  //   });
  // });
});
