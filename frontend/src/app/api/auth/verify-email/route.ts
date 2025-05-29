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

  const url = `${apiUrl}api/auth/verifyOTP/`;
  console.log("Verification URL:", url);

  try {
    const { email, otp } = await request.json();
    console.log("Verification request data:", { email, otp });

    if (!email || !otp) {
      console.error("Missing required fields for verification");
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      }),
    });

    const data = await response.json().catch((error) => {
      console.error("Failed to parse verification response:", error);
      return { error: "Invalid response from server" };
    });

    console.log("Verification response:", { status: response.status, data });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.detail || "Email verification failed",
          details: data,
        },
        { status: response.status }
      );
    }

    // Forward the Set-Cookie header if present
    const responseHeaders = new Headers();
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      responseHeaders.set("Set-Cookie", setCookieHeader);
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Email verified successfully",
        user: data.user,
      }),
      {
        status: 200,
        headers: responseHeaders,
      }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during email verification",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
