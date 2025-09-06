import { NextResponse, NextRequest } from "next/server";
const api_url = process.env.NEXT_PUBLIC_API_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: room_id } = await params;
  const response = await fetch(`${api_url}chat/api/rooms/${room_id}/close/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      room_id: room_id,
    }),
  });

  if (!response.ok) {
    console.error("Failed to close chat room", response);
    return NextResponse.json(
      { error: "Failed to close chat room" },
      { status: response.status }
    );
  }

  return NextResponse.json(await response.json());
}
