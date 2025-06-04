import { NextResponse } from "next/server";
import { NewsArticle } from "@/data/news";

// Get all news articles
export async function GET() {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const url = `${api_url}news/api/news/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }
    const data = await response.json();
    console.log("data", data.results);

    return NextResponse.json(data.results as NewsArticle[]);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
