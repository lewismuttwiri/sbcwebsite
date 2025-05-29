import { OrderDetails } from "@/types/orderDetails";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  console.error("NEXT_PUBLIC_API_URL is not defined in environment variables");
}

export async function getAllOrders(): Promise<OrderDetails[]> {
  const url = `${API_URL}store/api/orders/`;
  console.log("Fetching orders from:", url);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }
    const data = await response.json();
    console.log("data", data.orders);
    return data.orders as OrderDetails[];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}
