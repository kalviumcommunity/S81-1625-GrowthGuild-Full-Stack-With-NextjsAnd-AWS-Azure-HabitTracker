import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import {
  checkPermission,
  getRequestActor,
  unauthorizedResponse,
} from "@/lib/rbac";
import {
  detectSqliRisk,
  parseSafeInt,
  sanitizeInput,
} from "@/lib/security";

// GET /api/habits?userId=1
export async function GET(req: Request) {
  try {
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

    const canReadHabits = checkPermission({
      actor,
      permission: "read_habits",
      resource: "habits",
      action: "list",
    });

    if (!canReadHabits) {
      return sendError(
        "Access denied: insufficient permissions",
        ERROR_CODES.AUTHORIZATION_ERROR,
        403
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const requestedUserId = userId ? parseSafeInt(userId, actor.userId) : actor.userId;

    const effectiveUserId = actor.role === "admin" ? requestedUserId : actor.userId;

    const whereClause = { userId: effectiveUserId, isActive: true };

    const habits = await prisma.habit.findMany({
      where: whereClause,
      include: {
        logs: {
          orderBy: { date: "desc" },
          take: 7, // Last 7 logs
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(habits, "Habits fetched successfully");
  } catch (error) {
    return sendError(
      "Failed to fetch habits",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

// POST /api/habits - Create a new habit
export async function POST(req: Request) {
  try {
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

    const canCreateHabits = checkPermission({
      actor,
      permission: "create_habit",
      resource: "habit",
      action: "create",
    });

    if (!canCreateHabits) {
      return sendError(
        "Access denied: insufficient permissions",
        ERROR_CODES.AUTHORIZATION_ERROR,
        403
      );
    }

    const body = await req.json();
    const { title, description, frequency, userId } = body;
    const cleanTitle = sanitizeInput(title);
    const cleanDescription = description ? sanitizeInput(description) : null;
    const cleanFrequency = frequency ? sanitizeInput(frequency) : "DAILY";
    const targetUserId = actor.role === "admin" && userId ? parseSafeInt(userId, actor.userId) : actor.userId;

    // Validation
    if (!cleanTitle) {
      return sendError(
        "Title is required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    if ([cleanTitle, cleanDescription || "", cleanFrequency].some(detectSqliRisk)) {
      return sendError(
        "Input rejected by security policy",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const habit = await prisma.habit.create({
      data: {
        title: cleanTitle,
        description: cleanDescription,
        frequency: cleanFrequency,
        userId: targetUserId,
        isActive: true,
      },
    });

    return sendSuccess(habit, "Habit created successfully", 201);
  } catch (error) {
    return sendError(
      "Failed to create habit",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
