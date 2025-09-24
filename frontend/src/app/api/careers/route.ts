import { NextResponse } from "next/server";

export async function GET() {
  const api_url = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${api_url}careers/api/job-advertisement/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    const data = await response.json();
    return NextResponse.json(data.results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const body = await req.json();

  const jobPostingData = {
    title: body.title,
    location: body.location,
    type: body.type,
    department: body.department,
    description: body.description,
    requirements:
      body.requirements?.filter((req: string) => req.trim() !== "") || [],
    is_active: true,
  };

  try {
    const endpoint = `${api_url}careers/api/jobs-applications/`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(jobPostingData),
    });

    const responseData = await response.text();
    let parsedData;

    try {
      parsedData = responseData ? JSON.parse(responseData) : {};
    } catch (e) {
      parsedData = { rawResponse: responseData };
    }

    if (!response.ok) {
      const errorMessage =
        parsedData.detail ||
        parsedData.message ||
        `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to create a job",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
