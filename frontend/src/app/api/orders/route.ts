import { getServerAuthHeaders } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const url = `${apiUrl}store/api/orders/`;

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
