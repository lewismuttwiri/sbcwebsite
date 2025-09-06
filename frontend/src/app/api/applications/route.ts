import { NextResponse } from "next/server";

const api_url = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    let allApplications: any[] = [];
    let nextUrl = `${api_url}careers/api/job-applications/`;

    // Fetch all pages
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        mode: "cors",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to fetch applications");
        break;
      }

      const data = await response.json();
      allApplications = [...allApplications, ...(data.results || [])];

      // Check if there's a next page
      nextUrl = data.next;

      // If we're on the first page, log some debug info
      if (!nextUrl) {
        console.log(`Fetched ${allApplications.length} applications in total`);
      }
    }

    // Sort applications by date (newest first) if needed
    // const sortedApplications = [...allApplications].sort(
    //   (a, b) =>
    //     new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime()
    // );

    return NextResponse.json(allApplications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
