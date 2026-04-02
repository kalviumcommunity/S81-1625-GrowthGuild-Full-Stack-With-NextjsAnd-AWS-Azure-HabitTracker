import { NextResponse } from "next/server";
import {
  checkPermission,
  getRequestActor,
  unauthorizedResponse,
} from "@/lib/rbac";

export async function GET(req: Request) {
  const actor = getRequestActor(req);
  if (!actor) {
    return unauthorizedResponse();
  }

  const canManageUsers = checkPermission({
    actor,
    permission: "manage_users",
    resource: "admin",
    action: "read",
  });

  if (!canManageUsers) {
    return NextResponse.json(
      { success: false, message: "Access denied: admin role required" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Welcome Admin! You have full access.",
  });
}
