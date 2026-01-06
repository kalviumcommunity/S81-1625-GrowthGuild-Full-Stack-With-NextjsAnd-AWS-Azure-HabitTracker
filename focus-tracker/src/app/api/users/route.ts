import { handleError } from "@/lib/errorHandler";

export async function GET() {
  try {
    // Simulate failure
    throw new Error("Database connection failed!");
  } catch (error) {
    return handleError(error, "GET /api/users");
  }
}
