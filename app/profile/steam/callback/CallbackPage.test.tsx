import { render, screen } from "@testing-library/react";
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import SteamCallback from "./page";

vi.mock("@/app/components/wrapper", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wrapper">{children}</div>
  ),
}));

describe("SteamCallback", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      }),
    ) as Mock;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Wrapper component with the correct content", () => {
    render(<SteamCallback />);
    expect(screen.getByTestId("wrapper")).toBeInTheDocument();
    expect(screen.getByText("Hello World: Steam Callback")).toBeInTheDocument();
  });

  it("sends a POST request with the correct URL and body on mount", () => {
    const mockFetch = vi.spyOn(global, "fetch");
    render(<SteamCallback />);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8000/link/steam/auth",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ url: window.location.href }),
        redirect: "follow",
      }),
    );
  });
});
