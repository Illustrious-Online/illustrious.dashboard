"use client";

import Wrapper from "@/app/components/wrapper";
import { Button, Heading } from "@chakra-ui/react";
import { toaster } from "./components/toaster";

export default function Home() {
  return (
    <Wrapper>
      <Heading as="h1" size="2xl">
        Illustrious Dashboard
      </Heading>
    </Wrapper>
  );
}
