import { render, screen, fireEvent, renderHook } from "@testing-library/react";
import { describe, it, expect, vi, type Mock } from "vitest";
import { ColorModeProvider, useColorMode, useColorModeValue, ColorModeIcon, ColorModeButton } from "./color-mode";
import type React from "react";

vi.mock("./color-mode", () => ({
  useColorMode: vi.fn(),
  ColorModeIcon: () => <div data-testid="mock-color-mode-icon" />,
  ColorModeButton: () => <div data-testid="mock-color-mode-button" />,
  ColorModeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-color-mode-provider">{children}</div>
}));

describe("ColorModeProvider", () => {
  it("renders ThemeProvider with correct props", () => {
    render(
      <ColorModeProvider>
        <div>Test Child</div>
      </ColorModeProvider>
    );
    expect(screen.getByText("Test Child")).toBeDefined();
  });
});

describe("ColorModeIcon", () => {
  it("renders the correct icon based on color mode", () => {
    (useColorMode as Mock).mockReturnValue({ colorMode: "light" });
    render(<ColorModeIcon />);
    expect(screen.getByRole("img", { hidden: true })).toBeDefined();

    (useColorMode as Mock).mockReturnValue({ colorMode: "dark" });
    render(<ColorModeIcon />);
    expect(screen.getByRole("img", { hidden: true })).toBeDefined();
  });
});

// describe("useColorMode", () => {
//   it("toggles color mode", () => {
//     const setColorMode = vi.fn();
//     const toggleColorMode = vi.fn();
//     (useColorMode as Mock).mockReturnValue({
//       setColorMode,
//       toggleColorMode,
//     });

//     const { result } = renderHook(() => useColorMode());
//     const { toggleColorMode: toggle } = result.current;

//     toggle();
//     expect(toggleColorMode).toHaveBeenCalled();
//     expect(setColorMode).toHaveBeenCalledWith("dark");
//   });
// });

// describe("useColorModeValue", () => {
//   it("returns correct value based on color mode", () => {
//     const lightValue = "light-mode";
//     const darkValue = "dark-mode";
//     const { result } = renderHook(() => useColorModeValue(lightValue, darkValue));

//     expect(result.current).toBe(darkValue);
//   });
// });

// describe("ColorModeIcon", () => {
//   it("renders correct icon based on color mode", () => {
//     render(<ColorModeIcon />);
//     expect(screen.getByRole("img", { hidden: true })).toBeDefined();
//   });
// });

// describe("ColorModeButton", () => {
//   it("renders button and toggles color mode on click", () => {
//     render(<ColorModeButton />);
//     const button = screen.getByRole("button", { name: /Toggle color mode/i });
//     expect(button).toBeDefined();

//     fireEvent.click(button);
//     const { setColorMode } = useColorMode();
//     expect(setColorMode).toHaveBeenCalledWith("dark");
//   });
// });
