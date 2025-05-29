import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const url = `${apiUrl}api/auth/login/`;
  console.log("Login URL:", url);

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Login attempt for:", email);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password: password,
      }),
      credentials: "include",
    });

    const data = await response.json().catch((error) => {
      console.error("Failed to parse login response:", error);
      return { error: "Invalid response from server" };
    });

    console.log("Login response status:", response.status);

    if (!response.ok) {
      const errorMessage = data.detail || data.error || "Login failed";
      console.error("Login failed:", errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status || 401 }
      );
    }

    // Forward the Set-Cookie header from the backend if request is successful
    const responseHeaders = new Headers();
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      responseHeaders.set("Set-Cookie", setCookieHeader);
      console.log("Set-Cookie header forwarded");
    }

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
