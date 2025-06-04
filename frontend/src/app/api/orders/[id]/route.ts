import { getServerAuthHeaders } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  req: Request,
  context: RouteContext
): Promise<Response> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const resolvedParams = await context.params;
  const { id } = resolvedParams;
  console.log("id", id);

  if (!id) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  const url = `${apiUrl}store/api/orders/${id}/`;

  const token = req.headers.get("Authorization");

  console.log("token", token);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json();
    console.log("Orders data", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
