"use client";

import { Toaster, toaster } from "@/components/toaster";
import { Box, Button, Heading, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("https://api.illustrious.cloud/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      toaster.create({
        title: "Success",
        description: "Logged in successfully!",
        type: "success",
        duration: 2000,
      });
    } catch (error) {
      const err = error as Error;
      toaster.create({
        title: "Error",
        description: err?.message || "Login failed",
        type: "error",
        duration: 2000,
      });
    }
  };

  return (
    <>
      <Toaster />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <VStack gap={4} p={8} boxShadow="lg" borderRadius="lg">
          <Heading>Login</Heading>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <Button colorScheme="teal" onClick={handleLogin}>
            Login
          </Button>
        </VStack>
      </Box>
    </>
  );
}
