import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const POST = async (req: Request) => {
  const body = await req.json();
  console.log("Chat request:", body);
  const response = await fetch(`${API_URL}chat/api/create-room/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      enquiry: body.enquiry,
    }),
  });

  if (!response.ok) {
    console.error("Failed to create chat room", response);
    return NextResponse.json(
      { error: "Failed to create chat room" },
      { status: 500 }
    );
  }

  const data = await response.json();
  console.log("Chat room created:", data);

  return NextResponse.json(data);
};

export const GET = async () => {
  const response = await fetch(`${API_URL}chat/api/rooms/`);
  console.log("Chat rooms response:", response);
  const data = await response.json();

  return NextResponse.json(data);
};
