import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const body = await req.json();

  console.log("Job posting request:", body);

  try {
    const endpoint = `${api_url}careers/api/jobs-advertisements/`;
    console.log("Forwarding to:", endpoint);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...body,
        requirements:
          body.requirements?.filter((req: string) => req.trim() !== "") || [],
        is_active: true,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Backend error:", responseData);
      return NextResponse.json(
        { error: "Failed to create job", details: responseData },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      {
        error: "Failed to create job",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
