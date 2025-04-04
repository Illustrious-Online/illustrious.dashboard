import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type Mock, describe, expect, it } from "vitest";
import { vi } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    redirect: vi.fn(),
  },
}));

describe("POST /api/auth/logout", () => {
  it("should sign out the user and redirect to the home page", async () => {
    const mockSignOut = vi.fn();
    const mockSupabase = {
      auth: {
        signOut: mockSignOut,
      },
    };

    (createServerSupabaseClient as Mock).mockResolvedValue(mockSupabase);

    const mockRedirect = vi.fn();
    (NextResponse.redirect as Mock).mockImplementation(mockRedirect);

    await POST();

    expect(createServerSupabaseClient).toHaveBeenCalled();
    expect(mockSignOut).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
    );
  });
});
