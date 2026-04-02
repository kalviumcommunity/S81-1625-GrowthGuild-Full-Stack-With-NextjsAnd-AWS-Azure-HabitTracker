import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface TokenUserPayload {
  id: number;
  email: string;
  role: string;
}

interface AccessTokenPayload extends TokenUserPayload {
  type: "access";
}

interface RefreshTokenPayload extends TokenUserPayload {
  type: "refresh";
}

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || "7d";
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets are not configured.");
}

export const REFRESH_COOKIE_NAME = "refreshToken";

export function createAccessToken(user: TokenUserPayload): string {
  return jwt.sign(
    { ...user, type: "access" } satisfies AccessTokenPayload,
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

export function createRefreshToken(user: TokenUserPayload): string {
  return jwt.sign(
    { ...user, type: "refresh" } satisfies RefreshTokenPayload,
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL }
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
  if (decoded.type !== "access") {
    throw new Error("Invalid access token type");
  }
  return decoded;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
  if (decoded.type !== "refresh") {
    throw new Error("Invalid refresh token type");
  }
  return decoded;
}

export function getRefreshCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60,
  };
}

export function clearRefreshCookieOptions() {
  const base = getRefreshCookieOptions();
  return {
    ...base,
    maxAge: 0,
  };
}

export function hasValidOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");

  // Non-browser calls may not send Origin.
  if (!origin) {
    return true;
  }

  return origin === req.nextUrl.origin;
}
