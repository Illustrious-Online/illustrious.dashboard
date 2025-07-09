import { AuthProvider } from "@/contexts/AuthContext";
import { ChakraProvider } from "@/providers/ChakraProvider";
import { ColorModeScript } from "@chakra-ui/color-mode";
// app/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Supabase Auth App",
  description: "Next.js application with Supabase authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorModeScript initialColorMode="system" />
      </head>
      <body>
        <ChakraProvider>
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
