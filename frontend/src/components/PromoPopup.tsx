"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PromoPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Only show popup if it hasn't been shown before in this session
    if (
      typeof window !== "undefined" &&
      !sessionStorage.getItem("popupShown")
    ) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("popupShown", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isClient) return null;

  const handlePromo = () => {
    setShowPopup(false);
    router.push("/news/9");
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-xl max-w-2xl w-full mx-auto p-6 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src="/images/promo/promo-1.png"
                    alt="Promotion"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">
                  🎉 Kunywa na Airtime Promo! 🎉
                </h2>
                <p className="mb-4">
                  Buy a bottle of Pepsi soda and get free airtime, data bundles
                  or M-pesa! <br /> Dial *459*3# enter the code under the crown
                  or cap and Win!
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handlePromo}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Learn More
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
