import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import {
  createAccessToken,
  createRefreshToken,
  getRefreshCookieOptions,
} from "@/lib/authTokens";
import { detectSqliRisk, sanitizeEmail, sanitizeInput } from "@/lib/security";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = sanitizeEmail(email);
    const cleanPassword = sanitizeInput(password);

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (detectSqliRisk(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Invalid login input" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(cleanPassword, user.password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = createAccessToken(tokenPayload);
    const refreshToken = createRefreshToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      accessToken,
    });

    response.cookies.set("refreshToken", refreshToken, getRefreshCookieOptions());

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
