import Wrapper from "@/components/ui/wrapper";
import { useAuth } from "@/contexts/AuthContext";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/client", () => ({
  createClientSupabaseClient: vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("Wrapper Component", () => {
  const mockSignOut = vi.fn();
  const mockPush = vi.fn();
  const mockSupabase = {
    auth: {
      signOut: mockSignOut,
    },
  };

  const renderWrapper = () => {
    return render(
      <ChakraProvider value={defaultSystem}>
        <Wrapper>
          <p>Test Content</p>
        </Wrapper>
      </ChakraProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClientSupabaseClient as unknown as Mock).mockReturnValue(mockSupabase);
    (useRouter as unknown as Mock).mockReturnValue({ push: mockPush });
  });

  it("renders children correctly", () => {
    (useAuth as unknown as Mock).mockReturnValue({ session: null });
    renderWrapper();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders logout button when session exists", () => {
    (useAuth as unknown as Mock).mockReturnValue({ session: {} });
    renderWrapper();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });

  it("calls signOut and redirects on logout", async () => {
    (useAuth as unknown as Mock).mockReturnValue({ session: {} });
    mockSignOut.mockResolvedValue({ error: null });

    renderWrapper();

    fireEvent.click(screen.getByText("Log Out"));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("displays an error if signOut fails", async () => {
    (useAuth as unknown as Mock).mockReturnValue({ session: {} });
    mockSignOut.mockResolvedValue({ error: { message: "Sign out error" } });

    renderWrapper();

    fireEvent.click(screen.getByText("Log Out"));

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.getByText("Sign out error")).toBeInTheDocument();
    });
  });
});
