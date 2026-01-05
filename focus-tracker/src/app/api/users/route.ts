import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

// GET /api/users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });

    return sendSuccess(users, "Users fetched successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return sendError(
      "Failed to fetch users",
      ERROR_CODES.DATABASE_ERROR,
      500,
      message
    );
  }
}

// POST /api/users
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.email) {
      return sendError(
        "Name and email are required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
      },
    });

    return sendSuccess(user, "User created successfully", 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    // Handle unique constraint error (duplicate email)
    if (message.includes("Unique constraint")) {
      return sendError(
        "Email already exists",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        message
      );
    }

    return sendError(
      "User creation failed",
      ERROR_CODES.DATABASE_ERROR,
      500,
      message
    );
  }
}
