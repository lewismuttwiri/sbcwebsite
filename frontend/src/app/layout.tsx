"use client";

import { Poetsen_One } from "next/font/google";
import "./globals.css";

// Components with relative paths to fix import issues
import Navbar from "@/components/layout/Navbar";
import ClientFooter from "@/components/layout/ClientFooter";
import ToastProvider from "@/components/providers/ToastProvider";
import NavigationLoader from "@/components/NavigationLoader";
import { Providers } from "@/providers";
import { Suspense, useState, useEffect } from "react";
import Loader from "@/components/loader";
import { usePathname } from "next/navigation";

const poetsen = Poetsen_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-poetsen",
  display: "swap",
  adjustFontFallback: false,
});

// Add this component to handle the loading state
function LoadingState() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPathname) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPrevPathname(pathname);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pathname, prevPathname]);

  if (!isLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poetsen.className}>
      <body className="min-h-screen bg-white">
        <style jsx global>{`
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
        `}</style>
        <Providers>
          <ToastProvider />
          <Suspense fallback={<Loader fullScreen />}>
            <Navbar />
            <main className="min-h-[calc(100vh-64px)] relative">
              <LoadingState />
              {children}
            </main>
            <ClientFooter />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
