import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  checkPermission,
  getRequestActor,
  unauthorizedResponse,
} from "@/lib/rbac";

// GET /api/habits/:id
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

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

    const canRead = checkPermission({
      actor,
      permission: "read_habits",
      resource: "habit",
      action: "read",
      targetUserId: habit.userId,
      allowOwner: true,
    });

    if (!canRead) {
      return NextResponse.json(
        { success: false, message: "Access denied: insufficient permissions" },
        { status: 403 }
      );
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
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body = await req.json();

    const existingHabit = await prisma.habit.findUnique({
      where: { id: Number(id) },
      select: { id: true, userId: true },
    });

    if (!existingHabit) {
      return NextResponse.json({ success: false, message: "Habit not found" }, { status: 404 });
    }

    const canUpdate = checkPermission({
      actor,
      permission: "update_habits",
      resource: "habit",
      action: "update",
      targetUserId: existingHabit.userId,
      allowOwner: true,
    });

    if (!canUpdate) {
      return NextResponse.json(
        { success: false, message: "Access denied: insufficient permissions" },
        { status: 403 }
      );
    }

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
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const existingHabit = await prisma.habit.findUnique({
      where: { id: Number(id) },
      select: { id: true, userId: true },
    });

    if (!existingHabit) {
      return NextResponse.json({ success: false, message: "Habit not found" }, { status: 404 });
    }

    const canDelete = checkPermission({
      actor,
      permission: "delete_habits",
      resource: "habit",
      action: "delete",
      targetUserId: existingHabit.userId,
    });

    if (!canDelete) {
      return NextResponse.json(
        { success: false, message: "Access denied: only admins can delete habits" },
        { status: 403 }
      );
    }

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
