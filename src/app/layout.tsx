import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import CustomCursor from "@/components/CustomCursor";
import CursorGates from "@/components/CursorGates";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Amer Abbadi — Full-Stack Developer",
  description: "Full-stack developer based in Northern Virginia. Building products with Next.js, React, and AI.",
  metadataBase: new URL("https://amerabbadi.com"),
  openGraph: {
    title: "Amer Abbadi — Full-Stack Developer",
    description: "Full-stack developer based in Northern Virginia. Building products with Next.js, React, and AI.",
    url: "https://amerabbadi.com",
    siteName: "Amer Abbadi",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amer Abbadi — Full-Stack Developer",
    description: "Full-stack developer based in Northern Virginia. Building products with Next.js, React, and AI.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} ${orbitron.variable}`} data-theme="dark">
      <body className="bg-bg font-sans antialiased">
        <ThemeProvider>
          <CustomCursor />
          <CursorGates />
          <ThemeToggle />
          <Nav />
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
