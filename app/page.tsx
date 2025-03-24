"use client";

import Wrapper from "@/app/components/wrapper";
import { Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <Wrapper>
      <p>Welcome to the Illustrious Dashboard!</p>
      <p>Future home for all things Illustrious.</p>
      <p>Stay tuned for updates!</p>
      <p>We are currently working on the following features:</p>
      <ol>
        <li>
          Illustrious Community
          <ul>
            <li>Forums</li>
            <li>Discord Integration</li>
            <li>Community Events</li>
            <li>Community Challenges</li>
            <li>Community Rewards</li>
            <li>Community Leaderboards</li>
            <li>Community Development</li>
            <li>Steam Integration</li>
            <li>Profile Management</li>
          </ul>
        </li>
        <li>
          Illustrious Gaming
          <ul>
            <li>Game Library</li>
            <li>Game Management</li>
            <li>Game Development</li>
            <li>Game Publishing</li>
            <li>Game Distribution</li>
          </ul>
        </li>
        <li>
          Illustrious Development
          <ul>
            <li>Development Organizations</li>
            <li>Development Teams</li>
            <li>Development Projects</li>
            <li>Development Tools</li>
            <li>Development Resources</li>
          </ul>
        </li>
      </ol>
    </Wrapper>
  );
}
