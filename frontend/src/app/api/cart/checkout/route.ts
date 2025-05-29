import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Checkout request:", body);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}store/api/orders/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This will include cookies with the request
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create order");
    }
    const data = await response.json();
    console.log("Order created:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
