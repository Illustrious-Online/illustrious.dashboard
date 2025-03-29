import Wrapper from "@/components/wrapper";
import { Box, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Wrapper>
      <Box width={"80vw"} margin={"auto"} padding={4}>
        <Heading as="h1">Illustrious Dashboard</Heading>
        <Heading as="h2">Created by Illustrious Online</Heading>
        <Heading as="h3">Future home for all things Illustrious.</Heading>
        <Text>Stay tuned for updates!</Text>
        <Text>We are currently working on the following features:</Text>
        <Box as="ol" paddingLeft={6}>
          <Box as="li" marginBottom={4}>
            Illustrious Community
            <Box as="ul" paddingLeft={6}>
              <Box as="li">Forums</Box>
              <Box as="li">Discord Integration</Box>
              <Box as="li">Community Events</Box>
              <Box as="li">Community Challenges</Box>
              <Box as="li">Community Rewards</Box>
              <Box as="li">Community Leaderboards</Box>
              <Box as="li">Community Development</Box>
              <Box as="li">Steam Integration</Box>
              <Box as="li">Profile Management</Box>
            </Box>
          </Box>
          <Box as="li" marginBottom={4}>
            Illustrious Gaming
            <Box as="ul" paddingLeft={6}>
              <Box as="li">Game Library</Box>
              <Box as="li">Game Management</Box>
              <Box as="li">Game Development</Box>
              <Box as="li">Game Publishing</Box>
              <Box as="li">Game Distribution</Box>
            </Box>
          </Box>
          <Box as="li" marginBottom={4}>
            Illustrious Development
            <Box as="ul" paddingLeft={6}>
              <Box as="li">Development Organizations</Box>
              <Box as="li">Development Teams</Box>
              <Box as="li">Development Projects</Box>
              <Box as="li">Development Tools</Box>
              <Box as="li">Development Resources</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Wrapper>
  );
}
