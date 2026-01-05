import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

// GET /api/habits
export async function GET() {
  try {
    const habits = await prisma.habit.findMany({
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
