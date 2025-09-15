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
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    const nextResponse = NextResponse.json(data);

    nextResponse.headers.set(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=600"
    );

    const etag = `"${Buffer.from(JSON.stringify(data))
      .toString("base64")
      .slice(0, 16)}"`;
    nextResponse.headers.set("ETag", etag);

    nextResponse.headers.set("Last-Modified", new Date().toUTCString());

    nextResponse.headers.set("Vary", "Accept, Accept-Encoding");

    return nextResponse;
  } catch (error) {
    const errorResponse = NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );

    errorResponse.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );

    return errorResponse;
  }
}

export const revalidate = 300;

export const dynamic = "auto";
