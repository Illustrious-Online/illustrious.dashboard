"use client";

import logo from "@/public/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import Image from "next/image";
import type { FC, ReactNode } from "react";
import * as React from "react";
import { ColorModeButton } from "./color-mode";
import { Toaster, toaster } from "./toaster";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

const Wrapper: FC<LayoutProps> = ({ children }) => {
  const { session, signOut } = useAuth()
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toaster.success({
        description: "Successfully signed out",
        duration: 2500,
      });
      router.push("/auth/login");
    }
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Toaster />
      <Flex as="nav" padding={4} color="white" align="center">
        <Image src={logo} alt="Logo" height={45} width={60} />
        <Spacer />
        {session && (
          <Button variant={"ghost"} onClick={handleSignOut}>
            Log Out
          </Button>
        )}
        <ColorModeButton />
      </Flex>

      <Box as="main" height="100%">
        {children}
      </Box>
    </Box>
  );
};

export default Wrapper;
