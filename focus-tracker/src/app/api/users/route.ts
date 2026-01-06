import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { userSchema } from "@/lib/schemas/userSchema";
import { ZodError } from "zod";

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

    // ✅ Zod validation
    const validatedData = userSchema.parse(body);

    const user = await prisma.user.create({
      data: validatedData,
    });

    return sendSuccess(user, "User created successfully", 201);
  } catch (error) {
    // ❌ Validation error
    if (error instanceof ZodError) {
      return sendError(
        "Validation Error",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        }))
      );
    }

    // ❌ Other errors
    return sendError(
      "User creation failed",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
}