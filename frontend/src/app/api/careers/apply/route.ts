import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const url = `${api_url}careers/api/job-applications/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to apply for job");
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to apply for job" },
      { status: 500 }
    );
  }
}
