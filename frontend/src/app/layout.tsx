import { Metadata } from "next";
import { Poetsen_One } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import ClientFooter from "@/components/layout/ClientFooter";
import ToastProvider from "@/components/providers/ToastProvider";
import NavigationLoader from "@/components/NavigationLoader";
import { Providers } from "@/providers";
import { Suspense } from "react";
import Loader from "@/components/loader";
import { metadata as siteMetadata } from "./metadata";

const poetsen = Poetsen_One({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-poetsen",
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poetsen.className} h-full`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --font-poetsen: ${poetsen.style.fontFamily};
            }
          `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white">
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
