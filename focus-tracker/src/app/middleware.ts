import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/about"];
const publicApiRoutes = ["/api/auth/login", "/api/auth/signup"];

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
    if (pathname.startsWith("/api/users") || pathname.startsWith("/api/admin")) {
      const authHeader = req.headers.get("authorization");
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return NextResponse.json(
          { success: false, message: "Token missing" },
          { status: 401 }
        );
      }

      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);

        // Admin-only check
        if (pathname.startsWith("/api/admin") && decoded.role !== "admin") {
          return NextResponse.json(
            { success: false, message: "Access denied" },
            { status: 403 }
          );
        }

        // Attach user info to headers
        const headers = new Headers(req.headers);
        headers.set("x-user-id", decoded.id);
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

  // Protected page routes - check for token in cookies
  // Note: For client-side auth with localStorage, the ProtectedRoute component handles this
  // This middleware provides an additional layer for cookie-based auth if needed
  
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
