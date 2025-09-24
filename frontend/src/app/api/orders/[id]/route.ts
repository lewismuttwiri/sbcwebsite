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

  if (!id) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  const url = `${apiUrl}store/api/orders/${id}/`;

  const token = req.headers.get("Authorization");

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
