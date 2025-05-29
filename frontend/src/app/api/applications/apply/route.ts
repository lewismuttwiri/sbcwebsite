import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiUrl}partner/api/apply/`;
  console.log("Submitting application...", url);
  const formData = await request.formData();

  // Log form data for debugging
  console.log("Form data received:");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  console.log("Form data received:", formData);
  try {
    // Forward the request to Django backend
    const response = await fetch(url, {
      method: "POST",
      // Don't set Content-Type, let the browser set it with the correct boundary
      headers: {
        // Copy any authorization headers from the original request
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization") || "",
        }),
      },
      credentials: "include",
      body: formData,
    });

    // Get the response data
    let responseData;
    const responseText = await response.text();

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      // If JSON parsing fails, use the text as detail
      responseData = { detail: responseText };
    }

    if (!response.ok) {
      console.error("Backend error:", responseData);
      return NextResponse.json(
        { error: responseData.detail || "Failed to submit application" },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
