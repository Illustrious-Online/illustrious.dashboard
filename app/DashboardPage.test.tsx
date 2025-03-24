import { render, screen } from "@testing-library/react";
import Home from "./page";
import "@testing-library/jest-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { describe, expect, it } from "vitest";

const renderDashboard = () => {
  render(
    <ChakraProvider value={defaultSystem}>
      <Home />
    </ChakraProvider>,
  );
};

describe("Home Page", () => {
  it("renders the welcome message", () => {
    renderDashboard();
    const welcomeMessage = screen.getByText(
      /Welcome to the Illustrious Dashboard!/i,
    );
    expect(welcomeMessage).toBeInTheDocument();
  });

  it("renders the features list", () => {
    renderDashboard();
    const featuresHeading = screen.getByText(
      /We are currently working on the following features:/i,
    );
    expect(featuresHeading).toBeInTheDocument();

    const communityFeature = screen.getByText(/Illustrious Community/i);
    expect(communityFeature).toBeInTheDocument();

    const gamingFeature = screen.getByText(/Illustrious Gaming/i);
    expect(gamingFeature).toBeInTheDocument();

    const developmentFeature = screen.getByText(/Illustrious Development/i);
    expect(developmentFeature).toBeInTheDocument();
  });

  it("renders subfeatures under Illustrious Community", () => {
    renderDashboard();
    const forums = screen.getByText(/Forums/i);
    const discordIntegration = screen.getByText(/Discord Integration/i);
    expect(forums).toBeInTheDocument();
    expect(discordIntegration).toBeInTheDocument();
  });

  it("renders subfeatures under Illustrious Gaming", () => {
    renderDashboard();
    const gameLibrary = screen.getByText(/Game Library/i);
    const gameManagement = screen.getByText(/Game Management/i);
    expect(gameLibrary).toBeInTheDocument();
    expect(gameManagement).toBeInTheDocument();
  });

  it("renders subfeatures under Illustrious Development", () => {
    renderDashboard();
    const devOrganizations = screen.getByText(/Development Organizations/i);
    const devTeams = screen.getByText(/Development Teams/i);
    expect(devOrganizations).toBeInTheDocument();
    expect(devTeams).toBeInTheDocument();
  });
});
