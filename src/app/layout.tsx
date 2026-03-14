import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "World Cup 2026 Path Tracker",
  description:
    "See every possible venue-by-venue journey for any team to the 2026 FIFA World Cup Final.",
  openGraph: {
    title: "World Cup 2026 Path Tracker",
    description:
      "Pick any team and see every possible venue-by-venue journey to the 2026 FIFA World Cup Final.",
    type: "website",
    locale: "en_US",
    siteName: "World Cup 2026 Path Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Cup 2026 Path Tracker",
    description:
      "Pick any team and see every possible venue-by-venue journey to the 2026 FIFA World Cup Final.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
