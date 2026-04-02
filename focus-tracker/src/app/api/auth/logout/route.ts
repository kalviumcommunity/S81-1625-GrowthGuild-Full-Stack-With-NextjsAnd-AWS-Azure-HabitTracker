import { NextRequest, NextResponse } from "next/server";
import {
  clearRefreshCookieOptions,
  hasValidOrigin,
  REFRESH_COOKIE_NAME,
} from "@/lib/authTokens";

export async function POST(req: NextRequest) {
  if (!hasValidOrigin(req)) {
    return NextResponse.json(
      { success: false, message: "Invalid origin" },
      { status: 403 }
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out",
  });

  response.cookies.set(REFRESH_COOKIE_NAME, "", clearRefreshCookieOptions());
  return response;
}
