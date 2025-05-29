import { NextResponse } from "next/server";
import type { Application } from "../../../applications/types";
import { RouteContext } from "../../orders/[id]/route";

// Mock database - replace with actual database calls
let mockApplications: Application[] = [
  {
    id: "1",
    applicantName: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    position: "Frontend Developer",
    resumeUrl: "/resumes/john-doe.pdf",
    coverLetter: "I am excited to apply for this position...",
    status: "pending",
    appliedDate: new Date().toISOString(),
    skills: ["React", "TypeScript", "Next.js"],
    experience: "3 years",
    notes: "",
  },
  {
    id: "2",
    applicantName: "Jane Smith",
    email: "jane@example.com",
    phone: "+1987654321",
    position: "Backend Developer",
    resumeUrl: "/resumes/jane-smith.pdf",
    coverLetter: "I would be a great fit for your team...",
    status: "pending",
    appliedDate: new Date().toISOString(),
    skills: ["Node.js", "Python", "Docker"],
    experience: "5 years",
    notes: "Strong backend experience",
  },
];

export async function GET(
  request: Request,
  context: RouteContext
): Promise<Response> {
  // @ts-ignore - Workaround for Next.js 13+ type issues
  const { id } = await context.params;
  try {
    // In a real application, you would:
    // 1. Verify the user is authenticated and has HR role
    // 2. Fetch the specific application from the database

    const application = mockApplications.find((app) => app.id === id);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;

  console.log("id", id);

  if (!id) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    // In a real application, you would:
    // 1. Verify the user is authenticated and has HR role
    // 2. Update the application in the database

    const body = await request.json();
    const applicationIndex = mockApplications.findIndex((app) => app.id === id);

    if (applicationIndex === -1) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Update the application
    mockApplications[applicationIndex] = {
      ...mockApplications[applicationIndex],
      ...body,
      // Ensure the ID remains the same
      id: id,
    };

    return NextResponse.json(mockApplications[applicationIndex]);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
