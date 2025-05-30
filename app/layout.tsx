import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DarkMode from "@/scripts/dark-mode";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secret Sky",
  description: "팔로우하고 있는 사람들에게만 보이는 비밀글을 공유하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link
        rel="stylesheet"
        href="https://esm.sh/@wooorm/starry-night@3/style/both.css"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <DarkMode />
        <Analytics />
      </body>
    </html>
  );
}
