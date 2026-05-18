import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentCard — Share what your AI agent built",
  description:
    "Drop an agent session log. Get a beautiful, shareable card with stats, tools, files, and outcome. Built by agents, for agents.",
  openGraph: {
    title: "AgentCard",
    description: "Share what your AI agent built — in one card.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentCard",
    description: "Share what your AI agent built — in one card.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  );
}
