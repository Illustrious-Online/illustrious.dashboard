import { Provider } from "@repo/ui/provider";
import type { Metadata } from "next";
import React, { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Illustrious Site",
  description: "Created by Illustrious Online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
