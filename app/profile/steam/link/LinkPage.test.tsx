import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import LinkSteam from "./page";

vi.mock("@/app/components/wrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wrapper">{children}</div>
  ),
}));

global.fetch = vi.fn();

const renderLinkPage = () => {
  render(
    <ChakraProvider value={defaultSystem}>
      <LinkSteam />
    </ChakraProvider>,
  );
};

describe("LinkSteam Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component correctly", () => {
    renderLinkPage();
    expect(screen.getByText("Hello World: Link Steam")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Login with steam" }),
    ).toBeInTheDocument();
  });

  it("sets authUrl and redirects when API call is successful", async () => {
    const mockUrl = "http://example.com";
    (fetch as Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({ url: mockUrl }),
    });

    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });

    renderLinkPage();
    const button = screen.getByRole("button", { name: "Login with steam" });

    fireEvent.click(button);

    await waitFor(() => {
      expect(window.location.href).toBe(mockUrl);
    });
  });

  it("displays an error message when API call fails", async () => {
    (fetch as Mock).mockRejectedValueOnce(new Error("API error"));

    renderLinkPage();
    const button = screen.getByRole("button", { name: "Login with steam" });

    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("An error occurred while sending the request."),
      ).toBeInTheDocument();
    });
  });
});
