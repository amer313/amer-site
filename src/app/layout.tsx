import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import NoiseOverlay from "@/components/NoiseOverlay";
import TopBar from "@/components/TopBar";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
});

const description =
  "Founder of Quint — behavioral security for AI agents. Software engineer at Amazon. Building trust for machines that think.";

export const metadata: Metadata = {
  title: "Amer Abbadi — Security Engineer & Founder",
  description,
  metadataBase: new URL("https://amerabbadi.com"),
  openGraph: {
    title: "Amer Abbadi — Security Engineer & Founder",
    description,
    url: "https://amerabbadi.com",
    siteName: "Amer Abbadi",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amer Abbadi — Security Engineer & Founder",
    description,
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
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrains.variable} ${instrument.variable}`}
    >
      <body className="bg-bg font-sans antialiased">
        <CustomCursor />
        <NoiseOverlay />
        <TopBar />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
