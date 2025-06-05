import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const api_url = process.env.NEXT_API_PUBLIC_URL;
  const { id } = await params;

  try {
    const response = await fetch(
      `${api_url}careers/api/job-advertisements/${id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    const data = await response.json();
    console.log("data", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await req.json();
  console.log("Job application body", body);
  const api_url = process.env.NEXT_API_PUBLIC_URL;
  const url = `${api_url}/careers/api/jobs-advertisements/${id}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to apply for job");
    }
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Error applying for job:", error);
    return NextResponse.json(
      { error: "Failed to apply for job" },
      { status: 500 }
    );
  }
}
