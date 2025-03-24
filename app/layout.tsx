import { Provider } from "@/app/components/provider";
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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
