import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log("Environment variables:", {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!apiUrl) {
    const errorMsg =
      "API_URL is not defined in environment variables. Please check your .env.local file";
    console.error(errorMsg);
    return NextResponse.json(
      {
        error: "Server configuration error",
        details: errorMsg,
        availableVars: {
          API_URL: process.env.API_URL,
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        },
      },
      { status: 500 }
    );
  }

  const url = `${apiUrl}api/auth/register/`;

  try {
    const requestData = await request.json();

    if (!requestData) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      confirm_password,
      user_role,
    } = requestData;
    console.log("Received registration data:", requestData);

    // Basic validation
    if (!first_name || !email || !password || !confirm_password) {
      console.error("Missing required fields:", {
        first_name,
        email,
        password,
        confirm_password,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password !== confirm_password) {
      console.error("Passwords do not match");
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const body = JSON.stringify({
      first_name: first_name,
      last_name: last_name || "",
      email: email,
      phone_number: phone_number || "",
      password: password,
      confirm_password: confirm_password,
      user_role: user_role || 4, // Default to 4 if not provided
    });

    console.log("📤 Sending registration request to:", url);
    console.log("📝 Request body:", body);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body,
    });

    const data = await response.json().catch((error) => {
      console.error("Failed to parse response:", error);
      return { error: "Invalid response from server" };
    });

    console.log("📥 Registration response status:", response.status);

    if (!response.ok) {
      console.error("Registration failed:", data);
      return NextResponse.json(
        { error: data.detail || data.error || "Registration failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
