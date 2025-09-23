import { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import ClientFooter from "@/components/layout/ClientFooter";
import ToastProvider from "@/components/providers/ToastProvider";
import { Providers } from "@/providers";
import { Suspense } from "react";
import Loader from "@/components/loader";
import { metadata as siteMetadata } from "./metadata";
import PromoPopup from "@/components/PromoPopup";
import ChatWidget from "@/components/ChatWidget";
import Container from "@/components/layout/Container";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Added missing weights
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-montserrat",
  style: ["normal"],
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white font-sans">
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
          <PromoPopup />
        </Providers>
      </body>
    </html>
  );
}
