import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { resolveTheme } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Bench",
  description: "Internal work management tool for Apon Venture Lab.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = resolveTheme((await cookies()).get("bench-theme")?.value);
  return (
    <html lang="en" data-theme={theme} style={{ colorScheme: theme }}>
      <body>{children}</body>
    </html>
  );
}
