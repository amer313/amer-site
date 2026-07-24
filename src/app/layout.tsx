import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import NoiseOverlay from "@/components/NoiseOverlay";
import FlowField from "@/components/FlowField";
import TopBar from "@/components/TopBar";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const description =
  "Engineer and founder. Building security for autonomous systems. Building trust for machines that think.";

export const metadata: Metadata = {
  title: "Amer Abbadi | Engineer & Founder",
  description,
  metadataBase: new URL("https://amerabbadi.com"),
  openGraph: {
    title: "Amer Abbadi | Engineer & Founder",
    description,
    url: "https://amerabbadi.com",
    siteName: "Amer Abbadi",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amer Abbadi | Engineer & Founder",
    description,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
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
      className={`${archivo.variable} ${jetbrains.variable}`}
    >
      <body className="bg-bg font-sans antialiased">
        <FlowField />
        <NoiseOverlay />
        <TopBar />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
