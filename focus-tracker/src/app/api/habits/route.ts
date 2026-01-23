import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

// GET /api/habits?userId=1
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const whereClause = userId
      ? { userId: parseInt(userId), isActive: true }
      : { isActive: true };

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
    const body = await req.json();
    const { title, description, frequency, userId } = body;

    // Validation
    if (!title || !userId) {
      return sendError(
        "Title and userId are required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const habit = await prisma.habit.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        frequency: frequency || "DAILY",
        userId: parseInt(userId),
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
