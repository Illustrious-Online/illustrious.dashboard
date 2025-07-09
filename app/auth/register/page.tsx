import Wrapper from "@/components/ui/wrapper";
import { Box, Heading } from "@chakra-ui/react";
import RegistrationForm from "./registration-form";

export default function RegisterPage() {
  return (
    <Wrapper>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <Heading marginBottom={4}>Register a new account</Heading>
        <RegistrationForm />
      </Box>
    </Wrapper>
  );
}
