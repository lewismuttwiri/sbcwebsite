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

    console.log("Response status:", response.status);
    console.log("Response:", response);

    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    const data = await response.json();
    console.log("data", data.results);
    return NextResponse.json(data.results);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const body = await req.json();

  // Log the incoming request
  console.log("Incoming request body:", body);

  // Format the request payload for job postings
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

  console.log("Formatted job posting data:", jobPostingData);

  try {
    const endpoint = `${api_url}careers/api/jobs-applications/`;
    console.log("Making POST request to:", endpoint);
    console.log("Request payload:", JSON.stringify(jobPostingData, null, 2));

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
      console.error("Failed to parse response as JSON:", responseData);
      parsedData = { rawResponse: responseData };
    }

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries([...response.headers.entries()])
    );
    console.log("Response data:", parsedData);

    if (!response.ok) {
      const errorMessage =
        parsedData.detail ||
        parsedData.message ||
        `Request failed with status ${response.status}`;
      console.error("Error response:", errorMessage);
      throw new Error(errorMessage);
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Error creating a job:", error);
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
