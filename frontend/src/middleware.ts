import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths that don't require authentication
const publicPaths = [
  "/",
  "/about",
  "/contact",
  "/products",
  "/media",
  "/social",
  "/careers",
  "/careers/jobs",
  "/careers/jobs/[jobId]",
  "/careers/jobs/[jobId]/apply",
  "/partner/distributor",
  "/partner/distributor/apply",
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/api/auth",
  "/cart",
  "/checkout",
];

// Paths that require authentication
const privatePaths = [
  "/account",
  "/orders",
  "/orders/[orderId]",
  "/applications",
  "/applications/[applicationId]",
  "/dashboard",
  "/profile",
  "/cart/checkout",
];

// Paths that require specific roles
const roleProtectedPaths = {
  hr: ["/applications", "/careers/new-opening"],
  admin: ["/dashboard/admin"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and _next paths
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".") // Static files with extensions
  ) {
    return NextResponse.next();
  }

  // If the path is public, allow access
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if the path requires authentication
  const requiresAuth = privatePaths.some((path) => pathname.startsWith(path));

  // Get auth state from Django session cookie
  const sessionCookie = request.cookies.get("sessionid")?.value;
  const isAuthenticated = !!sessionCookie;

  // If the path requires authentication and user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based protection
  for (const [role, paths] of Object.entries(roleProtectedPaths)) {
    if (paths.some((path) => pathname.startsWith(path))) {
      const userRole = request.cookies.get("user_role")?.value;
      if (userRole !== role) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }
  }

  // Add headers to the request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "x-user-role",
    request.cookies.get("user_role")?.value || "guest"
  );
  requestHeaders.set("x-is-authenticated", isAuthenticated ? "true" : "false");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
