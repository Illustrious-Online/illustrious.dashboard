import { createServerSupabaseClient } from "@/lib/supabase/server";
import { UserService } from "@/services/user-service";
import { NextResponse } from "next/server";
import { type Mock, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

vi.mock("@/services/user-service", () => ({
  UserService: vi.fn().mockImplementation(() => ({
    getUser: vi.fn(),
    createUser: vi.fn(),
  })),
}));

describe("GET /api/auth/callback", () => {
  it("should redirect to '/' if no code is provided", async () => {
    const request = new Request("http://localhost/api/auth/callback");
    const response = await GET(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBe("http://localhost/");
  });

  it("should exchange code for session and create user if not exists", async () => {
    const mockSupabaseClient = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({
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
        }),
      },
    };

    const mockUserService = {
      getUser: vi.fn().mockResolvedValue(null),
      createUser: vi.fn().mockResolvedValue(undefined),
    };

    (createServerSupabaseClient as Mock).mockResolvedValue(mockSupabaseClient);
    (UserService as unknown as Mock).mockImplementation(() => mockUserService);

    const request = new Request(
      "http://localhost/api/auth/callback?code=test-code",
    );
    const response = await GET(request);

    expect(createServerSupabaseClient).toHaveBeenCalled();
    expect(mockSupabaseClient.auth.exchangeCodeForSession).toHaveBeenCalledWith(
      "test-code",
    );
    expect(mockUserService.getUser).toHaveBeenCalledWith("user-id");
    expect(mockUserService.createUser).toHaveBeenCalledWith({
      id: "user-id",
      email: "user@example.com",
      avatarUrl: "http://example.com/avatar.png",
      firstName: "John",
      lastName: "Doe",
    });
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBe("http://localhost/");
  });

  it("should not create user if user already exists", async () => {
    const mockSupabaseClient = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({
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
        }),
      },
    };

    const mockUserService = {
      getUser: vi.fn().mockResolvedValue({ id: "existing-user-id" }),
      createUser: vi.fn(),
    };

    (createServerSupabaseClient as Mock).mockResolvedValue(mockSupabaseClient);
    (UserService as unknown as Mock).mockImplementation(() => mockUserService);

    const request = new Request(
      "http://localhost/api/auth/callback?code=test-code",
    );
    const response = await GET(request);

    expect(createServerSupabaseClient).toHaveBeenCalled();
    expect(mockSupabaseClient.auth.exchangeCodeForSession).toHaveBeenCalledWith(
      "test-code",
    );
    expect(mockUserService.getUser).toHaveBeenCalledWith("existing-user-id");
    expect(mockUserService.createUser).not.toHaveBeenCalled();
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBe("http://localhost/");
  });

  it("should handle errors during code exchange", async () => {
    const mockSupabaseClient = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({
          data: null,
          error: new Error("Exchange failed"),
        }),
      },
    };

    (createServerSupabaseClient as Mock).mockResolvedValue(mockSupabaseClient);

    const request = new Request(
      "http://localhost/api/auth/callback?code=test-code",
    );
    const response = await GET(request);

    expect(createServerSupabaseClient).toHaveBeenCalled();
    expect(mockSupabaseClient.auth.exchangeCodeForSession).toHaveBeenCalledWith(
      "test-code",
    );
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBe("http://localhost/");
  });
});
