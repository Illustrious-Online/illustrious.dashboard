import { Box, Heading, VStack } from "@chakra-ui/react";
import AuthForm from "./AuthForm";

export default function AuthPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <VStack
        gap={4}
        p={4}
        borderWidth={1}
        borderRadius={8}
        borderColor="gray.200"
      >
        <Heading>Sign in to your account</Heading>
        <AuthForm />
      </VStack>
    </Box>
  );
}
