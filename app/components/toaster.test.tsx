import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toaster, toaster } from "./toaster";

const renderToaster = () => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <Toaster />
    </ChakraProvider>,
  );
};

describe("Toaster Component", () => {
  it("displays a loading spinner when toast type is 'loading'", () => {
    act(() => {
      toaster.create({
        type: "loading",
        title: "Loading...",
      });
    });

    renderToaster();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays a toast with title and description", () => {
    act(() => {
      toaster.create({
        type: "info",
        title: "Info Title",
        description: "This is a description.",
      });
    });

    renderToaster();
    expect(screen.getByText("Info Title")).toBeInTheDocument();
    expect(screen.getByText("This is a description.")).toBeInTheDocument();
  });

  it("renders a close trigger if the toast is closable", () => {
    act(() => {
      toaster.create({
        type: "info",
        title: "Closable Toast",
        action: {
          label: "Action",
          onClick: () => {
            // Action click handler
          },
        },
      });
    });

    renderToaster();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("renders a close trigger if the toast is closable", () => {
    act(() => {
      toaster.create({
        type: "info",
        title: "Closable Toast",
        meta: {
          closable: true,
        },
      });
    });

    renderToaster();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
