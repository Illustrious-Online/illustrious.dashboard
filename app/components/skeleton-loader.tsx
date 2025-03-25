import {
  Container,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  VStack,
} from "@chakra-ui/react";
import type React from "react";

export const FullPageSkeletonLoader: React.FC = () => {
  return (
    <Container maxW="container.xl" centerContent>
      <VStack gap={6} width="full" mt={10}>
        <HStack width="full" gap={4}>
          <SkeletonCircle size="12" />
          <Skeleton height="20px" width="200px" />
        </HStack>

        <Skeleton height="200px" width="full" />

        <SkeletonText mt="4" noOfLines={4} gap="4" height="2" width="full" />

        <HStack width="full" justifyContent="space-between">
          <Skeleton height="40px" width="100px" />
          <Skeleton height="40px" width="100px" />
        </HStack>
      </VStack>
    </Container>
  );
};

export const TableSkeletonLoader: React.FC = () => {
  return (
    <VStack width="full" gap={4}>
      <HStack width="full" justifyContent="space-between">
        <Skeleton height="40px" width="200px" />
        <Skeleton height="40px" width="100px" />
      </HStack>

      {[1, 2, 3, 4, 5].map((row) => (
        <HStack key={row} width="full" gap={4}>
          <Skeleton height="20px" width="50px" />
          <Skeleton height="20px" width="full" />
          <Skeleton height="20px" width="100px" />
        </HStack>
      ))}
    </VStack>
  );
};
