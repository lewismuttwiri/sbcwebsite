// Client-side auth headers (for use in client components, useEffect, etc.)
export function getClientAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") {
    throw new Error("getClientAuthHeaders can only be used on the client side");
  }

  try {
    // Get cookies using document.cookie (client-side approach)
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(";").shift() || null;
      }
      return null;
    };

    // Try to get token from different possible cookie names
    const authToken = getCookie("auth_token");
    console.log("auth_token:", authToken);
    const token = getCookie("token");
    console.log("token:", token);
    const accessToken = getCookie("access_token");
    console.log("access_token:", accessToken);
    const sessionId = getCookie("sessionid");
    console.log("sessionid:", sessionId);

    // Also check localStorage
    const user = localStorage.getItem("user");
    console.log("user:", user);
    let localStorageToken = null;
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        localStorageToken = parsedUser.entity?.token || null;
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
    console.log("local_storage_token:", localStorageToken);

    // Priority order: auth_token > token > access_token > localStorage token
    const finalToken = authToken || token || accessToken || localStorageToken;
    console.log("finalToken:", finalToken);

    if (finalToken) {
      return {
        Authorization: `Bearer ${finalToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
    }

    // If using Django session authentication
    if (sessionId) {
      console.log("Found session ID in cookies");
      return {
        Cookie: `sessionid=${sessionId}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
    }

    throw new Error("No authentication credentials found");
  } catch (error) {
    console.error("Error getting client auth headers:", error);
    throw error;
  }
}

// Server-side auth headers for Pages Router API routes
// Use this in your /pages/api/* files
export function getServerAuthHeaders(req: any): Record<string, string> {
  try {
    // Get cookies from the request object in Pages Router
    const cookies = req.cookies || {};

    // Try to get token from different possible cookie names
    const authToken = cookies.auth_token;
    console.log("auth_token:", authToken);
    const token = cookies.token;
    console.log("token:", token);
    const accessToken = cookies.access_token;
    console.log("access_token:", accessToken);
    const sessionId = cookies.sessionid;
    console.log("sessionid:", sessionId);

    // Priority order: auth_token > token > access_token
    const finalToken = authToken || token || accessToken;
    console.log("finalToken:", finalToken);

    if (finalToken) {
      console.log("Found auth token in cookies");
      return {
        Authorization: `Bearer ${finalToken}`,
        "Content-Type": "application/json",
      };
    }

    // If using Django session authentication

    console.warn("No authentication credentials found in server-side context");
    throw new Error("No authentication credentials found");
  } catch (error) {
    console.error("Error getting server auth headers:", error);
    throw error;
  }
}
