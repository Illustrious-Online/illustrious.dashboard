'use client'

import {
  Box,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react'
import AuthGuard from '@/components/ui/auth-guard'

export default function LoginPage() {

  return (
    <AuthGuard>
      <Box maxW="md" mx="auto" py={12} px={6}>
        <VStack gap={8} align="stretch">
          <VStack gap={4} align="center">
            <Heading>Helo</Heading>
            <Text color="gray.600">Sign in to your account</Text>
          </VStack>
        </VStack>
      </Box>
    </AuthGuard>
  )
}
