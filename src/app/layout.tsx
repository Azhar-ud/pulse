import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PULSE // Builder's terminal",
  description:
    "A live terminal for what builders watch — Hacker News, GitHub trending, crypto markets, weather across builder cities. Refreshing every minute. Free upstream data, no signup.",
  metadataBase: new URL("https://pulse-seven-jet.vercel.app"),
  openGraph: {
    title: "PULSE // Builder's terminal",
    description:
      "A live terminal for what builders watch — Hacker News, GitHub trending, markets, weather.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plex.variable} h-full antialiased`}>
      <body className="relative min-h-full bg-bg text-ink">{children}</body>
    </html>
  );
}
