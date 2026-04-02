import { NextRequest, NextResponse } from "next/server";
import {
  createAccessToken,
  createRefreshToken,
  getRefreshCookieOptions,
  hasValidOrigin,
  REFRESH_COOKIE_NAME,
  verifyRefreshToken,
} from "@/lib/authTokens";

export async function POST(req: NextRequest) {
  try {
    if (!hasValidOrigin(req)) {
      return NextResponse.json(
        { success: false, message: "Invalid origin" },
        { status: 403 }
      );
    }

    const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token missing" },
        { status: 401 }
      );
    }

    const payload = verifyRefreshToken(refreshToken);
    const tokenPayload = { id: payload.id, email: payload.email, role: payload.role };

    const newAccessToken = createAccessToken(tokenPayload);
    const newRefreshToken = createRefreshToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      message: "Token refreshed",
    });

    response.cookies.set(REFRESH_COOKIE_NAME, newRefreshToken, getRefreshCookieOptions());
    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid or expired refresh token" },
      { status: 401 }
    );
  }
}
