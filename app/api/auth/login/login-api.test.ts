import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

describe("POST /api/auth/login", () => {
  const mockSupabaseClient = {
    auth: {
      signInWithPassword: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createServerSupabaseClient as Mock).mockResolvedValue(mockSupabaseClient);
  });

  it("should return 400 if signInWithPassword fails", async () => {
    const mockRequest = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: new URLSearchParams({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    });

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      error: { message: "Invalid credentials" },
    });

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: "Invalid credentials" });
  });

  it("should redirect to home if signInWithPassword succeeds", async () => {
    const mockRequest = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: new URLSearchParams({
        email: "test@example.com",
        password: "correctpassword",
      }),
    });

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      error: null,
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/");
  });
});
