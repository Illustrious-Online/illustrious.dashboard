import Wrapper from "@/components/ui/wrapper";
import { Box, Heading } from "@chakra-ui/react";
import UpdatePasswordForm from "./update-password-form";

export default function UpdatePasswordPage() {
  return (
    <Wrapper>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <Heading marginBottom={4}>Please set your new password</Heading>
        <UpdatePasswordForm />
      </Box>
    </Wrapper>
  );
}
