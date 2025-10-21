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
import { Montserrat } from "next/font/google";
import MainContent from "@/components/layout/MainContent";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
            <MainContent>{children}</MainContent>

            <ClientFooter />
          </Suspense>
          <PromoPopup />
        </Providers>
      </body>
    </html>
  );
}
