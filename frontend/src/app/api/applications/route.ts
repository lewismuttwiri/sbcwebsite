import { NextResponse } from "next/server";
import { Application } from "../../applications/types";

const api_url = process.env.NEXT_PUBLIC_URL;
const url = `${api_url}api/applications/`;

export async function GET() {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        // "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }
    const data = await response.json();
    const sortedApplications = [...data].sort(
      (a, b) =>
        new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    );
    return NextResponse.json(sortedApplications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
