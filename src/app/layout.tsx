import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@mantine/core/styles.css";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Aviary Manager",
  description: "Aviary management dashboard with Supabase auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
