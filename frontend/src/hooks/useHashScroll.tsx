// hooks/useHashScroll.ts
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function useHashScroll() {
  const router = useRouter();
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    const scrollToHash = (hash: string, attempt = 1, maxAttempts = 10) => {
      if (!hash) return;

      const element = document.querySelector(hash);
      if (element) {
        // Reset the flag when successfully scrolling
        hasScrolledRef.current = true;

        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else if (attempt < maxAttempts) {
        // Retry with increasing delays
        const delay = Math.min(100 * attempt, 1000);
        setTimeout(() => scrollToHash(hash, attempt + 1, maxAttempts), delay);
      }
    };

    const handleRouteChange = () => {
      hasScrolledRef.current = false;

      // Get hash from current URL
      const hash = window.location.hash;
      if (hash) {
        // Start scrolling attempts
        scrollToHash(hash);
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash;
      scrollToHash(hash);
    };

    // Handle initial load
    handleRouteChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [router]);
}
