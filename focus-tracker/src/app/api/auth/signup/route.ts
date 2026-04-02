import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { safeRedisDel } from "@/lib/redis";
import { sendEmail, isSESConfigured } from "@/lib/email";
import { welcomeEmailTemplate } from "@/lib/emailTemplates";
import { detectSqliRisk, sanitizeEmail, sanitizeInput } from "@/lib/security";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeEmail(email);
    const cleanPassword = sanitizeInput(password);

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if ([cleanName, cleanEmail].some(detectSqliRisk)) {
      return NextResponse.json(
        { success: false, message: "Input rejected by security policy" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Clear cached users list (silently fails if Redis unavailable)
    await safeRedisDel("users:list");

    // Send welcome email (non-blocking, don't fail signup if email fails)
    if (isSESConfigured()) {
      const welcomeEmail = welcomeEmailTemplate(cleanName);
      sendEmail({
        to: cleanEmail,
        subject: welcomeEmail.subject,
        html: welcomeEmail.html,
        text: welcomeEmail.text,
      }).catch((err) => {
        console.error("Failed to send welcome email:", err);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Signup successful",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Signup failed" },
      { status: 500 }
    );
  }
}
