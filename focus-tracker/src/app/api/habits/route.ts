import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/habits?page=1&limit=5
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;

  const habits = await prisma.habit.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ page, limit, habits }, { status: 200 });
}

// POST /api/habits
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.userId) {
      return NextResponse.json(
        { error: "Title and userId are required" },
        { status: 400 }
      );
    }

    const habit = await prisma.habit.create({
      data: body,
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Habit creation failed" },
      { status: 500 }
    );
  }
}