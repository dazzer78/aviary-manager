import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@tabler/core/dist/css/tabler.min.css";
import "./globals.css";

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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}