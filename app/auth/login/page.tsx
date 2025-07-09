import Wrapper from "@/components/ui/wrapper";
import { Box, Heading } from "@chakra-ui/react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <Wrapper>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <Heading marginBottom={4}>Sign in to your account</Heading>
        <LoginForm />
      </Box>
    </Wrapper>
  );
}
