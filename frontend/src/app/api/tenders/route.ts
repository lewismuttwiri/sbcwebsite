import { NextResponse } from "next/server";

let tenders = [
  {
    id: 1,
    tenderNumber: "TND-2024-001",
    description: "Supply of Office Equipment",
    document: "/tenders/doc1.pdf",
    additionalInfo: "Open to all registered vendors",
    closingDate: "2024-07-15",
  },
  {
    id: 2,
    tenderNumber: "TND-2024-002",
    description: "Construction of New Office Block",
    document: "/tenders/doc2.pdf",
    additionalInfo: "Pre-qualification required",
    closingDate: "2024-08-01",
  },
];

// export async function GET() {
//   try {
//     return NextResponse.json({ success: true, data: tenders });
//   } catch (error) {
//     console.error("Error fetching tenders:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch tenders" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${api_url}tenders/api/tenders/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch tenders");
    }

    const data = await response.json();
    return NextResponse.json(data.entity);
  } catch (error) {
    console.error("Error fetching tenders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tenders" },
      { status: 500 }
    );
  }
}

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();

//     // Basic validation
//     if (!data.tenderNumber || !data.description || !data.closingDate) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Create new tender
//     const newTender = {
//       id: tenders.length > 0 ? Math.max(...tenders.map((t) => t.id)) + 1 : 1,
//       tenderNumber: data.tenderNumber,
//       description: data.description,
//       document: data.document || "",
//       additionalInfo: data.additionalInfo || "",
//       closingDate: data.closingDate,
//     };

//     // In a real app, save to database here
//     tenders.push(newTender);

//     return NextResponse.json(
//       { success: true, data: newTender },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating tender:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to create tender" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  try {
    const formData = await request.formData();

    // Log form data for debugging
    const formDataObj: { [key: string]: any } = {};
    for (const [key, value] of formData.entries()) {
      formDataObj[key] =
        value instanceof File
          ? { name: value.name, size: value.size, type: value.type }
          : value;
    }
    console.log("Form data received:", formDataObj);

    // Forward the request to the backend
    const response = await fetch(`${api_url}tenders/api/tenders/`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      console.error("Failed to parse error response:", e);
    }

    if (!response.ok) {
      console.error("Backend error response:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
        headers: Object.fromEntries(response.headers.entries()),
      });
      throw new Error(
        errorData?.message ||
          errorData?.error ||
          `Server responded with status ${response.status}: ${response.statusText}`
      );
    }

    return NextResponse.json(errorData || { success: true });
  } catch (error) {
    console.error("Error in tender creation:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create tender",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.stack
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Tender ID is required" },
        { status: 400 }
      );
    }

    const tenderId = parseInt(id, 10);
    const tenderIndex = tenders.findIndex((t) => t.id === tenderId);

    if (tenderIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Tender not found" },
        { status: 404 }
      );
    }

    // In a real app, delete from database here
    tenders.splice(tenderIndex, 1);

    return NextResponse.json(
      { success: true, data: { id: tenderId } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tender:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete tender" },
      { status: 500 }
    );
  }
}
