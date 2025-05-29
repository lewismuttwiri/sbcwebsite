"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/layout/Container";
import Button from "@/components/Button";
import { format } from "date-fns";
import Image from "next/image";
import {
  FiPackage,
  FiArrowLeft,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { FiLoader as Spinner } from "react-icons/fi";
import { Order } from "@/types/order";
import OrderLoading from "./loading";

// Status icon component
const StatusIcon = ({ status }: { status: string }) => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "pending":
      return <FiClock className="text-yellow-500" />;
    case "processing":
      return <Spinner className="text-blue-500 animate-spin" />;
    case "shipped":
      return <FiTruck className="text-blue-500" />;
    case "delivered":
    case "completed":
      return <FiCheckCircle className="text-green-500" />;
    case "cancelled":
      return <FiXCircle className="text-red-500" />;
    default:
      return <FiPackage className="text-gray-400" />;
  }
};

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<any | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoadingOrder(true);
      try {
        const user: any = localStorage.getItem("user");
        console.log("user", user);
        let token = "";
        if (user) {
          try {
            const parsedUser = JSON.parse(user); // Convert string to object
            console.log("Parsed User", parsedUser);

            token = parsedUser?.entity?.token;
            console.log("Token:", token);
          } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
          }
        } else {
          console.log("No user found in localStorage");
        }

        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: token,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        console.log(response);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setIsLoadingOrder(false);
          throw new Error(errorData.error || "Failed to fetch order details");
        }
        const orderData = await response.json();
        console.log("Order data in details page:", orderData);
        setOrder(orderData);
        setIsLoadingOrder(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoadingOrder(false);
      } finally {
        setIsLoadingOrder(false);
      }
    };

    if (user && orderId) {
      fetchOrder();
    }
  }, [user, orderId]);

  if (isLoadingOrder) {
    return <OrderLoading />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6 text-gray-600">
            Please sign in to view order details.
          </p>
          <Button
            onClick={() => router.push(`/auth/login?from=/orders/${orderId}`)}
            className="w-full"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Error Loading Order</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={() => router.push("/orders")} className="w-full">
              Back to Orders
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-gray-400 mb-4">
            <FiPackage className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Button onClick={() => router.push("/orders")} className="w-full">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="mb-6 -ml-2 flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <div className="flex items-center space-x-2">
              <FiArrowLeft className="mr-1 h-4 w-4" />
              Back to orders
            </div>
          </Button>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order.order_number}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Placed on{" "}
                    {format(new Date(order.created_at), "MMMM d, yyyy")}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "shipped"
                        ? "bg-indigo-100 text-indigo-800"
                        : order.status === "completed" ||
                          order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <StatusIcon status={order.status} />
                    <span className="ml-1">
                      {order.status
                        .split("_")
                        .map(
                          (word: string) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-start space-x-4 py-4 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                            {item?.product_image ? (
                              <Image
                                src={item?.product_image}
                                alt={item?.product_name || "Product image"}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <FiPackage className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900">
                            {item?.product_name || "Product name not available"}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Qty: {item?.quantity || 0}
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            Ksh.
                            {item?.total_price
                              ? Number(item.total_price).toFixed(2)
                              : "0.00"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Ksh.{Number(item.total_price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        No items found in this order
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {order.shipping_address ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-900 font-medium">
                          {order.shipping_address.first_name}{" "}
                          {order.shipping_address.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.shipping_address.address_line1}
                        </p>
                        {order.shipping_address.address_line2 && (
                          <p className="text-sm text-gray-600">
                            {order.shipping_address.address_line2}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {order.shipping_address.city},{" "}
                          {order.shipping_address.state}{" "}
                          {order.shipping_address.postal_code}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.shipping_address.country}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Phone: {order.shipping_address.phone}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No shipping address provided
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Payment Method:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {order.payment_method || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Payment Status:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {order.payment_status
                            ? order.payment_status.charAt(0).toUpperCase() +
                              order.payment_status.slice(1)
                            : "N/A"}
                        </span>
                      </div>
                      {order.tracking_number && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Tracking Number:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {order.tracking_number}
                          </span>
                        </div>
                      )}
                      {order.tracking_url && (
                        <div className="mt-2">
                          <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:text-primary-dark"
                          >
                            Track Package
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order Total
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm text-gray-900">
                      Ksh: {Number(order.total_price).toFixed(2)}
                    </span>
                  </div>
                  {order.shipping_cost !== undefined &&
                    order.shipping_cost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Shipping</span>
                        <span className="text-sm text-gray-900">
                          Ksh{Number(0.0).toFixed(2)}
                        </span>
                      </div>
                    )}
                  {order.tax_amount !== undefined && order.tax_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tax</span>
                      <span className="text-sm text-gray-900">
                        ${Number(order.tax_amount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {order.discount_amount !== undefined &&
                    order.discount_amount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Discount</span>
                        <span className="text-sm text-green-600">
                          -${Number(order.discount_amount).toFixed(2)}
                        </span>
                      </div>
                    )}
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                    <span className="text-base font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-base font-medium text-gray-900">
                      Ksh: {Number(order.total_price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Order Notes
                  </h3>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">
                Need Help with Your Order?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                If you have any questions about your order, please contact our
                customer service team.
              </p>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={() => router.push("/contact")}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
