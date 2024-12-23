/**
 * @jest-environment jsdom
 */

import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import Wrapper from "./wrapper";

describe("Home", () => {
  it("renders Wrapper", () => {
    render(<Wrapper>Render Wrapper</Wrapper>);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders Wrapper and toggles dark mode", () => {
    render(
      <ChakraProvider>
        <Wrapper>Test Dark Mode</Wrapper>
      </ChakraProvider>,
    );

    const darkModeToggle = screen.getByTestId("themeToggle");
    expect(darkModeToggle).toBeVisible();
    expect(screen.getByTestId("moon")).toBeVisible();
    fireEvent.click(darkModeToggle);

    expect(screen.getByTestId("sun")).toBeVisible();
    fireEvent.click(darkModeToggle);

    expect(screen.getByTestId("moon")).toBeVisible();
  });

  it("renders Wrapper in mobile perspective", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 400,
    });

    Object.defineProperty(window, "innerHeight", {
      writable: true,
      value: 700,
    });

    render(<Wrapper>Test mobile navigation</Wrapper>);
    expect(window.innerWidth).toBe(400);
    expect(window.innerHeight).toBe(700);

    const hamburgerButton = screen.getByTestId("mobileToggle");
    expect(hamburgerButton).toBeVisible();
    fireEvent.click(hamburgerButton);

    const homeButton = screen.getByTestId("mobileNav");
    expect(homeButton).toBeVisible();
  });
});
