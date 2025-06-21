// frontend/src/app/thank-you/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useRef } from "react";

export default function ThankYouPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent running this effect more than once
    if (hasRun.current) return;

    clearCart();

    // Mark that this effect has run
    hasRun.current = true;
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-8">
          We've received your order and will process it shortly. You'll receive
          a confirmation message on Email shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 text-center"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
