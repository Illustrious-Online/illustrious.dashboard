"use client";

import { createClient } from "@/lib/supabase/client";
import logo from "@/public/logo.png";
import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FC, ReactNode } from "react";
import * as React from "react";
import { useAuth } from "../context/AuthContext";
import AuthGuard from "./auth-guard";
import { ColorModeButton } from "./color-mode";
import { Toaster, toaster } from "./toaster";

interface LayoutProps {
  children: ReactNode;
}

const Wrapper: FC<LayoutProps> = ({ children }) => {
  const { session } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toaster.error({
        title: "Error",
        description: error.message,
        duration: 2500,
      });
      console.error("Error signing out:", error.message);
    } else {
      router.push("/login");
      toaster.success({
        description: "Successfully signed out",
        duration: 2500,
      });
    }
  };

  return (
    <AuthGuard>
      <Box height="100vh" display="flex" flexDirection="column">
        <Toaster />
        <Flex as="nav" padding={4} color="white" align="center">
          <Image src={logo} alt="Logo" height={25} width={50} />
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
