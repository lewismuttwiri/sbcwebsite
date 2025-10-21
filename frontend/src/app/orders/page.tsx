"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  FiPackage,
  FiArrowRight,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiLoader as Spinner,
  FiShoppingBag,
  FiDollarSign,
  FiAlertCircle,
  FiHome,
  FiShoppingCart,
  FiMapPin,
  FiCalendar,
  FiPhone,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { OrderDetails } from "@/types/orderDetails";
import Loader from "@/components/loader";

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

const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status.toLowerCase();

  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  } as const;

  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  const statusClass =
    statusClasses[normalizedStatus as keyof typeof statusClasses] ||
    "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
    >
      <StatusIcon status={status} />
      <span className="ml-1">{statusText}</span>
    </span>
  );
};

const OrderCard = ({ order }: { order: any }) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mb-6">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2">
            <FiShoppingBag className="h-5 w-5 text-gray-400" />
            <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
          </div>
          <div className="mt-2 sm:mt-0">
            <StatusBadge status={order.status} />
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <FiCalendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
          <span>
            Placed on {format(new Date(order.created_at), "MMMM d, yyyy")}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-medium text-gray-500 flex items-center mb-3">
              <FiDollarSign className="mr-2 h-4 w-4" />
              Order Summary
            </h4>
            <div className="space-y-3">
              {order.items.map((item: any, index: any) => (
                <div
                  key={`${item.product_id}-${index}`}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center flex-1">
                    {item.image && (
                      <div className="h-12 w-12 flex-shrink-0 mr-3">
                        <Image
                          src={item.image}
                          alt={item.product_name || "Product image"}
                          width={48}
                          height={48}
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {item.product_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        KES:{Number(order.total_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 ml-4">
                    KES:{Number(order.total_price).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center font-semibold text-gray-900">
                  <p>Total</p>
                  <p>KES:{Number(order.total_price).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Info */}
          <div className="space-y-4">
            {/* Customer Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                <FiUser className="mr-2 h-4 w-4" />
                Customer
              </h4>
              <div className="text-sm text-gray-900 space-y-1">
                <p className="font-medium">{order.user_name}</p>
                <div className="flex items-center text-gray-600">
                  <FiMail className="mr-1.5 h-3 w-3" />
                  <span>{order.user_email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiPhone className="mr-1.5 h-3 w-3" />
                  <span>{order.phone_number}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                <FiMapPin className="mr-2 h-4 w-4" />
                Delivery Address
              </h4>
              <div className="text-sm text-gray-900 space-y-1">
                <p>{order.deliveryAddress}</p>
                <p>{order.city}</p>
              </div>
            </div>

            {/* Order Notes */}
            {order.order_notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Order Notes
                </h4>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {order.order_notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          onClick={() => router.push(`/orders/${order.id}`)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Details <FiArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [token, setToken] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        throw new Error("User not authenticated");
      }

      const parsedUser = JSON.parse(userData);
      const token = parsedUser?.entity?.token;

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch orders"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <FiAlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Orders {error}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center"
            >
              <span className="flex items-center justify-center">
                <FiHome className="mr-2" />
                Go Home
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <FiShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Orders Yet
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FiShoppingBag className="mr-2" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Orders list
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            View the status of your recent orders and manage returns.
          </p>
        </div>
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.updated_at} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}
