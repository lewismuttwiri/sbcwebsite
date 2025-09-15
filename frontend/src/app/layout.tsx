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
import PromoPopup from "@/components/PromoPopup";
import { Toaster } from "react-hot-toast";
import ChatWidget from "@/components/ChatWidget";
import Container from "@/components/layout/Container";

const poetsen = Poetsen_One({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-poetsen",
  style: ["normal"],
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={` h-full`} suppressHydrationWarning>
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
              <Container className="relative">
                <ChatWidget />
              </Container>
            </main>

            <ClientFooter />
          </Suspense>
          <Toaster position="bottom-right" />
          <PromoPopup />
        </Providers>
      </body>
    </html>
  );
}
