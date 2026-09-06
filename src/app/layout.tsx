import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bench",
  description: "Internal work management tool for Apon Venture Lab.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
