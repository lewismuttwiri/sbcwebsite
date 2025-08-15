import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Get the form data from the request
  const formData = await req.formData();
  console.log("Job application form data received");

  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const url = `${api_url}careers/api/job-applications/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData, // Forward the FormData directly
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to apply for job");
    }
    const data = await response.json();
    console.log("data", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error applying for job:", error);
    return NextResponse.json(
      { error: "Failed to apply for job" },
      { status: 500 }
    );
  }
}
