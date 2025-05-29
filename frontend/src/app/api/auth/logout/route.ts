import { NextResponse } from "next/server";

export async function POST() {
  const apiUrl = process.env.API_URL;
  const url = `${apiUrl}/api/auth/logout/`;

  console.log("📤 Logout request sent to:", url);

  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
