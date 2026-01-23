import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/habits/:id
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const habit = await prisma.habit.findUnique({
      where: { id: Number(id) },
      include: {
        logs: {
          orderBy: { date: "desc" },
          take: 30,
        },
      },
    });

    if (!habit) {
      return NextResponse.json({ success: false, message: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: habit }, { status: 200 });
  } catch (error) {
    console.error("Get habit error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch habit" }, { status: 500 });
  }
}

// PUT /api/habits/:id
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const habit = await prisma.habit.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        description: body.description,
        frequency: body.frequency,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({ success: true, data: habit, message: "Habit updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Update habit error:", error);
    return NextResponse.json({ success: false, message: "Failed to update habit" }, { status: 500 });
  }
}

// DELETE /api/habits/:id
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete associated logs first (if cascade isn't set up)
    await prisma.habitLog.deleteMany({
      where: { habitId: Number(id) },
    });

    await prisma.habit.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { success: true, message: "Habit deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete habit error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete habit" }, { status: 500 });
  }
}
