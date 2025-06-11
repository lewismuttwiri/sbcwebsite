import { Metadata } from "next";
import { Poetsen_One } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import ClientFooter from "@/components/layout/ClientFooter";
import ToastProvider from "@/components/providers/ToastProvider";
import { Providers } from "@/providers";
import { Suspense } from "react";
import Loader from "@/components/loader";
import { metadata as siteMetadata } from "./metadata";

const poetsen = Poetsen_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-poetsen",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poetsen.className}>
      <body className="min-h-screen bg-white">
        <style jsx global>
          {`
            :root {
              --font-poetsen: ${poetsen.style.fontFamily};
            }
            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
              font-family: var(--font-poetsen), sans-serif;
              font-weight: 400;
            }
          `}
        </style>
        <Providers>
          <ToastProvider />
          <Suspense fallback={<Loader fullScreen />}>
            <Navbar />
            <main className="min-h-[calc(100vh-64px)] relative">
              {children}
            </main>
            <ClientFooter />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
