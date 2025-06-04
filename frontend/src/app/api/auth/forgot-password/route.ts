import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

// Request a password reset email
export async function POST(request: Request) {
  const url = `${API_URL}auth/api/auth/resetpassword/`;

  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false,
          error: data.detail || "Failed to process password reset request"
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "If an account with this email exists, a password reset link has been sent"
    });

  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "An error occurred while processing your request" 
      },
      { status: 500 }
    );
  }
}

// Reset password with token and new password
export async function PUT(request: Request) {
  const url = `${API_URL}/api/auth/reset-password/`;

  try {
    const { token, new_password, confirm_password } = await request.json();
    
    if (!token || !new_password || !confirm_password) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Token, new password, and confirmation are required" 
        },
        { status: 400 }
      );
    }

    if (new_password !== confirm_password) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Passwords do not match" 
        },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        token,
        new_password,
        confirm_password 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false,
          error: data.detail || "Failed to reset password"
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully"
    });

  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "An error occurred while resetting your password" 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
