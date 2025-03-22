import { Box, Heading } from "@chakra-ui/react";
import LoginForm from "./LoginForm";
import Wrapper from "@/app/components/wrapper";

export default function AuthPage() {
  return (
    <Wrapper>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
        height="100%"
      >
        <Heading marginBottom={4}>Sign in to your account</Heading>
        <LoginForm />
      </Box>
    </Wrapper>
  );
}
