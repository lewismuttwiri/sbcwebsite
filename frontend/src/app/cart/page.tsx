"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from "react-icons/fi";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

function CartContent() {
  const router = useRouter();
  const {
    cart,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInitialized,
  } = useCart();

  console.log("cart", cart);

  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = () => {
    setIsLoading(true);
    if (!isAuthenticated) {
      toast("Please login to proceed with checkout");
      setIsLoading(false);
      return router.push("/auth/login");
    } else {
      console.log(isAuthenticated);
      if (totalItems < 20) {
        toast("Your cart items must be greater than 20");
        setIsLoading(false);
        return;
      }
      console.log(user);
      router.push("/cart/checkout");
      toast.success("Proceeding to checkout...");
    }
    setIsLoading(false);
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 0h10m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="secondary"
                onClick={() => router.push("/products")}
                className="flex justify-between items-center space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <FiArrowLeft className="w-4 h-4" />
                  <p>Continue Shopping</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // if (!isAuthenticated) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {totalItems > 0 && (
            <p className="text-gray-600">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          )}
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
              {cart.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row"
                >
                  <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.brandName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-lg font-medium text-gray-900">
                        Ksh.{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to clear your cart?")) {
                    clearCart();
                  }
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0 lg:col-span-4">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">
                    Ksh.{totalPrice.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">
                    {totalPrice > 1000 ? "Free" : "Free"}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">
                    Ksh.
                    {totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={() => {
                    handleCheckout();
                  }}
                  className="w-full justify-center py-3 text-base font-medium"
                >
                  {isLoading ? "Loading..." : "Proceed to Checkout"}
                </Button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  or{" "}
                  <Link
                    href="/products"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Continue Shopping
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return <CartContent />;
}
