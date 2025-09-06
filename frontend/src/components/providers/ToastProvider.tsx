"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#1f2937",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: 500,
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "white",
          },
        },
        error: {
          style: {
            background: "#FEE2E2",
            color: "#B91C1C",
          },
          iconTheme: {
            primary: "#DC2626",
            secondary: "white",
          },
        },
      }}
    />
  );
}
