import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { safeRedisDel } from "@/lib/redis";
import { sendEmail, isSESConfigured } from "@/lib/email";
import { welcomeEmailTemplate } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
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
      const welcomeEmail = welcomeEmailTemplate(name);
      sendEmail({
        to: email,
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
