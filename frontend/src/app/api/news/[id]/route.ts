import { NextResponse } from "next/server";
import { NewsArticle } from "@/data/news";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}news/api/news/${id}/`;
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
      if (response.status === 404) {
        return NextResponse.json(
          { error: "News article not found" },
          { status: 404 }
        );
      }
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch news article" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
