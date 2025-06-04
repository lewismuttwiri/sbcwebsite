import { Product } from "@/utils/productUtils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const url = `${API_URL}store/api/products/`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    console.log("data", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
