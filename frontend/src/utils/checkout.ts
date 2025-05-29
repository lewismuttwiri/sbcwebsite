import toast from "react-hot-toast";

export const checkout = async (orderDetails: any) => {
  try {
    const response = await fetch(`/api/cart/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(orderDetails),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }
    const data = await response.json();
    console.log("Order created:", data);

    return toast.success("Order created successfully");
  } catch (error) {
    console.error("Error creating order:", error);
    return toast.error("Failed to create order");
  }
};
