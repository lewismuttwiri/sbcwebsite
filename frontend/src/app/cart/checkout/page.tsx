"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/loader";
import { checkout } from "@/utils/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart: items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    deliveryAddress: "",
    city: "",
    additionalNotes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/cart/checkout");
    }
  }, [isAuthenticated, isLoading, router]);

  //isLoading ||
  if (!isAuthenticated) {
    return <Loader />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const total = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    try {
      // Prepare order details
      const orderDetails = {
        name: formData.name,
        phone_number: formData.phone,
        email: formData.email,
        address: formData.deliveryAddress,
        city: formData.city,
        additionalNotes: formData.additionalNotes,
        status: "pending",
        items: items.map((item) => ({
          image: item.image,
          id: item.id,
          name: item.name,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order_id: "",
        total: total,
      };

      console.log("Order details:", orderDetails);
      checkout(orderDetails);

      // Format WhatsApp message
      const message =
        `New Order!%0A%0A*Customer Details*%0A` +
        `Name: ${formData.name}%0A` +
        `Phone: ${formData.phone}%0A` +
        `Email: ${formData.email}%0A` +
        `Address: ${formData.deliveryAddress}%0A` +
        `City: ${formData.city}%0A` +
        `Notes: ${formData.additionalNotes || "None"}%0A%0A` +
        `*Order Items*%0A` +
        items
          .map(
            (item) =>
              `${item.name} x${item.quantity} - Ksh.${(
                item.price * item.quantity
              ).toFixed(2)}`
          )
          .join("%0A") +
        `%0A%0A*Total: Ksh.${total.toFixed(2)}*`;

      // Open WhatsApp with pre-filled message
      // window.open(`https://wa.me/254740411885?text=${message}`, "_blank");

      // Clear cart
      clearCart();

      // Show success message
      toast.success("Order submitted successfully!");

      // Redirect to thank you page
      router.push("/cart/thank-you");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (items.length === 0) {
  //   return (
  //     <div className="container mx-auto px-4 py-16 text-center">
  //       <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
  //       <p className="text-gray-600 mb-8">
  //         Looks like you haven't added any items to your cart yet.
  //       </p>
  //       <Link
  //         href="/"
  //         className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
  //       >
  //         Continue Shopping
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-md"
                >
                  {isSubmitting ? "Processing..." : "Complete Order"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p>Ksh.{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Subtotal</span>
                <span>
                  Ksh.
                  {items
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Delivery</span>
                <span>Ksh.0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>
                  Ksh.
                  {items
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
