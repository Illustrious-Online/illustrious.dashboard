import { render, screen, waitFor } from "@testing-library/react";
import { createClient } from "@/lib/supabase/client";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import type { Session, User } from "@supabase/supabase-js";
import { useAuth, AuthProvider } from "./AuthContext";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

const mockSession: Session = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: "bearer",
  user: {
    id: "mock-user-id",
    email: "user@example.com",
  } as User,
  expires_in: 0,
};

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides a user session when available", async () => {
    const mockSupabase = {
      auth: {
        getSession: vi
          .fn()
          .mockResolvedValue({ data: { session: mockSession } }),
        onAuthStateChange: vi
          .fn()
          .mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } },
          }),
      },
    };
    (createClient as unknown as Mock).mockReturnValue(mockSupabase);

    const TestComponent = () => {
      const { user, session, loading } = useAuth();
      return (
        <div>
          <p>Loading: {loading.toString()}</p>
          <p>User: {user?.email ?? "null"}</p>
          <p>Session: {session ? "active" : "null"}</p>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Loading: false")).toBeInTheDocument();
      expect(screen.getByText("User: user@example.com")).toBeInTheDocument();
      expect(screen.getByText("Session: active")).toBeInTheDocument();
    });
  });

  it("handles no session gracefully", async () => {
    const mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        onAuthStateChange: vi
          .fn()
          .mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } },
          }),
      },
    };
    (createClient as unknown as Mock).mockReturnValue(mockSupabase);

    const TestComponent = () => {
      const { user, session, loading } = useAuth();
      return (
        <div>
          <p>Loading: {loading.toString()}</p>
          <p>User: {user?.email ?? "null"}</p>
          <p>Session: {session ? "active" : "null"}</p>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Loading: false")).toBeInTheDocument();
      expect(screen.getByText("User: null")).toBeInTheDocument();
      expect(screen.getByText("Session: null")).toBeInTheDocument();
    });
  });
});
