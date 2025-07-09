"use client";

import logo from "@/public/logo.png";
import logoWhite from "@/public/logo-white.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { Box, Button, Flex, Image, Spacer } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import * as React from "react";
import { ColorModeButton, useColorMode } from "./color-mode";
import { Toaster, toaster } from "./toaster";
import { useRouter } from "next/navigation";
import AuthGuard from "./auth-guard";

interface LayoutProps {
  children: ReactNode;
}

const Wrapper: FC<LayoutProps> = ({ children }) => {
  const { session, signOut } = useAuth();
  const { colorMode } = useColorMode();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log('Error signing out:', error);
      toaster.success({
        description: "Successfully signed out",
        duration: 2500,
      });
      router.push("/auth/login");
    }
  };

  return (
    <AuthGuard>
      <Box height="100vh" display="flex" flexDirection="column">
        <Toaster />
        <Flex as="nav" padding={4} color="white" align="center">
          <Image borderRadius="md" src={colorMode === "dark" ? "/logo-white.jpg" : '/logo.png'} alt="Logo" width={14} />
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
    </AuthGuard>
  );
};

export default Wrapper;
