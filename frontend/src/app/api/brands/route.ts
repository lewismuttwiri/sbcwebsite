import { NextResponse } from "next/server";

export async function GET() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const url = `${API_URL}store/api/categories/`;

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
      throw new Error("Failed to fetch brands");
    }
    const data = await response.json();
    console.log("data", data.results);

    return NextResponse.json(data.results);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
