import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users
export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json(users, { status: 200 });
}

// POST /api/users
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email || !body.name) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: body,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "User creation failed" },
      { status: 500 }
    );
  }
}