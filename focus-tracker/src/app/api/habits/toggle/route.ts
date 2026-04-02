import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  checkPermission,
  getRequestActor,
  unauthorizedResponse,
} from "@/lib/rbac";

// POST /api/habits/toggle - Toggle habit completion for a specific date
export async function POST(req: Request) {
  try {
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const { habitId, date } = body;

    if (!habitId) {
      return NextResponse.json(
        { success: false, message: "Habit ID is required" },
        { status: 400 }
      );
    }

    // Use today's date if not provided
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Verify the habit belongs to the user
    const habit = await prisma.habit.findFirst({
      where: {
        id: parseInt(habitId),
      },
    });

    if (!habit) {
      return NextResponse.json(
        { success: false, message: "Habit not found" },
        { status: 404 }
      );
    }

    const canUpdate = checkPermission({
      actor,
      permission: "update_habits",
      resource: "habit",
      action: "toggle",
      targetUserId: habit.userId,
      allowOwner: true,
    });

    if (!canUpdate) {
      return NextResponse.json(
        { success: false, message: "Access denied: insufficient permissions" },
        { status: 403 }
      );
    }

    // Check if a log exists for this date
    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId: parseInt(habitId),
        date: {
          gte: targetDate,
          lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    let log;
    if (existingLog) {
      // Toggle the existing log
      log = await prisma.habitLog.update({
        where: { id: existingLog.id },
        data: { completed: !existingLog.completed },
      });
    } else {
      // Create a new log (completed = true since we're toggling from uncompleted)
      log = await prisma.habitLog.create({
        data: {
          habitId: parseInt(habitId),
          date: targetDate,
          completed: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        habitId: habit.id,
        habitTitle: habit.title,
        logId: log.id,
        completed: log.completed,
        date: log.date,
      },
      message: log.completed ? "Habit marked as completed!" : "Habit marked as incomplete",
    });
  } catch (error) {
    console.error("Toggle habit error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to toggle habit" },
      { status: 500 }
    );
  }
}
