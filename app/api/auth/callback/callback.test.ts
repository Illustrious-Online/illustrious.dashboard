import { createClient } from "@/lib/supabase/server";
import { UserService } from "@/services/user-service";
import { NextResponse } from "next/server";
import { type Mock, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/services/userService", () => ({
  UserService: vi.fn().mockImplementation(() => ({
    getUser: vi.fn(),
    createUser: vi.fn(),
  })),
}));

describe("GET /api/auth/callback", () => {
  it("should redirect to the home page if no code is provided", async () => {
    const request = new Request("http://localhost/api/auth/callback");
    const response = await GET(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBe("http://localhost/");
  });

  it("should exchange the code for a session and create a user if not exists", async () => {
    const mockExchangeCodeForSession = vi.fn().mockResolvedValue({
      data: {
        session: {
          user: {
            id: "user-id",
            email: "user@example.com",
            user_metadata: {
              avatar_url: "http://example.com/avatar.png",
              first_name: "John",
              last_name: "Doe",
            },
          },
        },
      },
      error: null,
    });

    const mockGetUser = vi.fn().mockResolvedValue(null);
    const mockCreateUser = vi.fn();

    (createClient as Mock).mockResolvedValue({
      auth: {
        exchangeCodeForSession: mockExchangeCodeForSession,
      },
    });

    (UserService as unknown as Mock).mockImplementation(() => ({
      getUser: mockGetUser,
      createUser: mockCreateUser,
    }));

    const request = new Request(
      "http://localhost/api/auth/callback?code=test-code",
    );
    const response = await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("test-code");
    expect(mockGetUser).toHaveBeenCalledWith("user-id");
    expect(mockCreateUser).toHaveBeenCalledWith({
      id: "user-id",
      email: "user@example.com",
      avatarUrl: "http://example.com/avatar.png",
      firstName: "John",
      lastName: "Doe",
    });
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBe("http://localhost/");
  });

  it("should not create a user if the user already exists", async () => {
    const mockExchangeCodeForSession = vi.fn().mockResolvedValue({
      data: {
        session: {
          user: {
            id: "existing-user-id",
            email: "existing@example.com",
            user_metadata: {
              avatar_url: "http://example.com/avatar.png",
              first_name: "Jane",
              last_name: "Doe",
            },
          },
        },
      },
      error: null,
    });

    const mockGetUser = vi.fn().mockResolvedValue({ id: "existing-user-id" });
    const mockCreateUser = vi.fn();

    (createClient as Mock).mockResolvedValue({
      auth: {
        exchangeCodeForSession: mockExchangeCodeForSession,
      },
    });

    (UserService as unknown as Mock).mockImplementation(() => ({
      getUser: mockGetUser,
      createUser: mockCreateUser,
    }));

    const request = new Request(
      "http://localhost/api/auth/callback?code=test-code",
    );
    const response = await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("test-code");
    expect(mockGetUser).toHaveBeenCalledWith("existing-user-id");
    expect(mockCreateUser).not.toHaveBeenCalled();
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBe("http://localhost/");
  });

  it("should handle errors during session exchange gracefully", async () => {
    const mockExchangeCodeForSession = vi.fn().mockResolvedValue({
      data: null,
      error: new Error("Session exchange failed"),
    });

    (createClient as Mock).mockResolvedValue({
      auth: {
        exchangeCodeForSession: mockExchangeCodeForSession,
      },
    });

    const request = new Request(
      "http://localhost/api/auth/callback?code=test-code",
    );
    const response = await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("test-code");
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBe("http://localhost/");
  });
});
