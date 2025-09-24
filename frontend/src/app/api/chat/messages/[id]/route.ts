import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const response = await fetch(`${API_URL}chat/api/messages/${id}/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch chat details" },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json(data.messages);
};
