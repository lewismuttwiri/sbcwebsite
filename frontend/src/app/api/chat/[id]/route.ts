import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  console.log("Fetching chat data for chatId:", id);

  const response = await fetch(`${API_URL}chat/api/rooms/${id}/messages/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    console.log("Failed to fetch chat details");
    return NextResponse.json(
      { error: "Failed to fetch chat details" },
      { status: response.status }
    );
  }

  const data = await response.json();
  console.log("Chat data:", data);
  return NextResponse.json(data);
};

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const body = await req.json();

  const response = await fetch(`${API_URL}api/chat/${id}/message/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      enquiry: body.enquiry,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return NextResponse.json({ message: "Message sent successfully" });
};
