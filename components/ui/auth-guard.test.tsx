import { useAuth } from "@/contexts/AuthContext";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import AuthGuard from "./auth-guard";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/loader", () => ({
  FullPageSkeletonLoader: () => <div data-testid="skeleton-loader" />,
}));

describe("AuthGuard", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("renders the skeleton loader when loading is true", () => {
    (useAuth as Mock).mockReturnValue({ user: null, loading: true });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
    );

    expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
  });

  it("renders children if user is authenticated and loading is false", () => {
    (useAuth as Mock).mockReturnValue({ user: { id: "123" }, loading: false });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
