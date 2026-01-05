import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/habits/:id
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const habit = await prisma.habit.findUnique({
    where: { id: Number(id) },
  });

  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  return NextResponse.json(habit, { status: 200 });
}

// PUT /api/habits/:id
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const habit = await prisma.habit.update({
    where: { id: Number(id) },
    data: body,
  });

  return NextResponse.json(habit, { status: 200 });
}

// DELETE /api/habits/:id
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.habit.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json(
    { message: "Habit deleted" },
    { status: 200 }
  );
}
