import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/authTokens";

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/about"];
const publicApiRoutes = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/refresh",
  "/api/auth/logout",
];

const protectedApiPrefixes = [
  "/api/users",
  "/api/admin",
  "/api/habits",
  "/api/files",
  "/api/upload",
  "/api/dashboard",
  "/api/email",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if this is an API route
  if (pathname.startsWith("/api")) {
    // Allow public API routes
    if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Protected API routes require token in header
    if (protectedApiPrefixes.some((prefix) => pathname.startsWith(prefix))) {
      const authHeader = req.headers.get("authorization");
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return NextResponse.json(
          { success: false, message: "Token missing" },
          { status: 401 }
        );
      }

      try {
        const decoded = verifyAccessToken(token);

        // Admin-only check
        if (pathname.startsWith("/api/admin") && decoded.role !== "admin") {
          return NextResponse.json(
            { success: false, message: "Access denied" },
            { status: 403 }
          );
        }

        // Attach user info to headers
        const headers = new Headers(req.headers);
        headers.set("x-user-id", String(decoded.id));
        headers.set("x-user-role", decoded.role);

        return NextResponse.next({ request: { headers } });
      } catch {
        return NextResponse.json(
          { success: false, message: "Invalid or expired token" },
          { status: 403 }
        );
      }
    }

    // Allow other API routes (habits, dashboard, etc.)
    return NextResponse.next();
  }

  // Check if this is a public page route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected page routes are handled client-side by ProtectedRoute.
  
  return NextResponse.next();
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
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
