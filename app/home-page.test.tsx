import { useAuth } from "@/contexts/AuthContext";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { type Mock, beforeEach, describe, expect, it } from "vitest";
import { vi } from "vitest";
import Home from "./page";

vi.mock("@/components/wrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const renderHome = () => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <Home />
    </ChakraProvider>,
  );
};

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as unknown as Mock).mockReturnValue({ session: null });
  });

  it("renders the main headings", () => {
    renderHome();
    expect(
      screen.getByRole("heading", { level: 1, name: /Illustrious Dashboard/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Created by Illustrious Online/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /Future home for all things Illustrious/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders feature list items", () => {
    renderHome();
    expect(screen.getByText(/Illustrious Community/i)).toBeInTheDocument();
    expect(screen.getByText(/Forums/i)).toBeInTheDocument();
    expect(screen.getByText(/Illustrious Gaming/i)).toBeInTheDocument();
    expect(screen.getByText(/Game Library/i)).toBeInTheDocument();
    expect(screen.getByText(/Illustrious Development/i)).toBeInTheDocument();
    expect(screen.getByText(/Development Organizations/i)).toBeInTheDocument();
  });
});
