import { NextResponse } from "next/server";

export async function GET() {
  const API_URL = process.env.API_URL;
  const url = `${API_URL}/api/auth/o/google-oauth2/?redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL}`;

  try {
    // Initiate the OAuth flow by redirecting to the backend
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      redirect: 'manual', // Prevent automatic redirect to handle it manually
    });

    // Get the redirect URL from the response
    const redirectUrl = response.headers.get('location');
    
    if (!redirectUrl) {
      throw new Error('No redirect URL received from the server');
    }

    // Redirect to the Google OAuth consent screen
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initiate Google sign-in' 
      },
      { status: 500 }
    );
  }
}

// Handle the OAuth callback
export async function POST(request: Request) {
  const API_URL = process.env.API_URL;
  const { code, state } = await request.json();

  if (!code || !state) {
    return NextResponse.json(
      { success: false, error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/o/google-oauth2/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        code,
        state,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL,
      }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: data.detail || 'Google authentication failed' 
        },
        { status: response.status }
      );
    }

    // Forward the Set-Cookie header if present
    const responseHeaders = new Headers();
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      responseHeaders.set('Set-Cookie', setCookieHeader);
    }

    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        user: data.user 
      }), 
      { 
        status: 200,
        headers: responseHeaders
      }
    );

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred during Google authentication' 
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
