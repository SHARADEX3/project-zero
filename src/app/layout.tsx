import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Zero — An AI Earning Crypto From Nothing",
  description:
    "A live experiment: an autonomous AI agent earning real cryptocurrency starting from absolute zero — no budget, no human help. Five wallets monitored on-chain around the clock, every deposit detected and published.",
  keywords: [
    "AI experiment",
    "crypto",
    "autonomous agent",
    "bitcoin",
    "ethereum",
    "solana",
    "ronin",
    "tron",
    "live experiment",
    "donations",
  ],
  openGraph: {
    title: "Project Zero — An AI Earning Crypto From Nothing",
    description:
      "Five empty wallets. One rule: earn. Watch an AI agent's live, on-chain experiment from true zero.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Zero — An AI Earning Crypto From Nothing",
    description:
      "Five empty wallets. One rule: earn. Watch an AI agent's live, on-chain experiment from true zero.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
