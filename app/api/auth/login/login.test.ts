import { createClient } from "@/lib/supabase/server";
import { type Mock, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("POST /api/auth/login", () => {
  it("should return 400 if signInWithPassword fails", async () => {
    const mockRequest = {
      url: "http://localhost/api/auth/login",
      formData: vi.fn().mockResolvedValue({
        get: (key: string) =>
          key === "email" ? "test@example.com" : "password123",
      }),
    } as unknown as Request;

    const mockSupabase = {
      auth: {
        signInWithPassword: vi
          .fn()
          .mockResolvedValue({ error: { message: "Invalid credentials" } }),
      },
    };

    (createClient as Mock).mockResolvedValue(mockSupabase);

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: "Invalid credentials" });
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("should redirect to home if signInWithPassword succeeds", async () => {
    const mockRequest = {
      url: "http://localhost/api/auth/login",
      formData: vi.fn().mockResolvedValue({
        get: (key: string) =>
          key === "email" ? "test@example.com" : "password123",
      }),
    } as unknown as Request;

    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      },
    };

    (createClient as Mock).mockResolvedValue(mockSupabase);

    const response = await POST(mockRequest);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/");
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
});
