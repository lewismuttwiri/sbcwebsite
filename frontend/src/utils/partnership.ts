"use client";

import { toast } from "react-hot-toast";

export const apply_distributor = async (formDataToSend: FormData) => {
  try {
    // Get auth token if user is logged in
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Create headers object
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    // Call the Next.js API route
    const response = await fetch("/api/applications/apply", {
      method: "POST",
      body: formDataToSend,
      headers: {
        ...headers,
        // Let the browser set the correct Content-Type with boundary
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", errorData);
      throw new Error(errorData.error || "Failed to submit application");
    }

    const data = await response.json();
    console.log("Success response:", data);
    toast.success("Application submitted successfully!");
    window.location.href = "/partner/distributor/apply/thank-you";
    return data;
  } catch (error: any) {
    console.error("Error applying for distributor:", error);
    toast.error(
      error.message || "Failed to submit application. Please try again later."
    );
    throw error; // Re-throw to allow handling in the component
  }
};
