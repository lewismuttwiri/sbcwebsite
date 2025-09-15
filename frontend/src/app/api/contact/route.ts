import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  console.log(body);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}contact/api/comments/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return NextResponse.json({ message: "Message sent successfully" });
}
