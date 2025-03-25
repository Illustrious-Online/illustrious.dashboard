import { Providers } from "@/providers";
import { ColorModeScript } from "@chakra-ui/color-mode"; // Correct import for ColorModeScript
import type { Metadata } from "next";
import React, { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Illustrious Dashboard",
  description: "Created by Illustrious Online",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorModeScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
