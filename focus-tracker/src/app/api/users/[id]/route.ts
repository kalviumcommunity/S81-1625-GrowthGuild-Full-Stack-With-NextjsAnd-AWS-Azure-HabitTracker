import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  checkPermission,
  getRequestActor,
  unauthorizedResponse,
} from "@/lib/rbac";
import { detectSqliRisk, sanitizeEmail, sanitizeInput } from "@/lib/security";

// GET /api/users/:id - Get a single user by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

    const canReadUsers = checkPermission({
      actor,
      permission: "read_users",
      resource: "user_profile",
      action: "read",
    });

    if (!canReadUsers) {
      return NextResponse.json(
        { success: false, message: "Access denied: insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;
    
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // Don't include password hash
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT /api/users/:id - Update a user
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

    const canManageUsers = checkPermission({
      actor,
      permission: "manage_users",
      resource: "user_profile",
      action: "update",
    });

    if (!canManageUsers) {
      return NextResponse.json(
        { success: false, message: "Access denied: admin role required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const cleanName = sanitizeInput(body.name || "");
    const cleanEmail = sanitizeEmail(body.email || "");
    const cleanRole = sanitizeInput(body.role || "");

    if (!cleanName || !cleanEmail || !cleanRole) {
      return NextResponse.json(
        { success: false, message: "name, email and role are required" },
        { status: 400 }
      );
    }

    if ([cleanName, cleanEmail, cleanRole].some(detectSqliRisk)) {
      return NextResponse.json(
        { success: false, message: "Input rejected by security policy" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name: cleanName,
        email: cleanEmail,
        role: cleanRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { success: true, data: user, message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/:id - Delete a user
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

    const canManageUsers = checkPermission({
      actor,
      permission: "manage_users",
      resource: "user_profile",
      action: "delete",
    });

    if (!canManageUsers) {
      return NextResponse.json(
        { success: false, message: "Access denied: admin role required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Delete associated data first
    await prisma.habitLog.deleteMany({
      where: {
        habit: {
          userId: Number(id),
        },
      },
    });

    await prisma.habit.deleteMany({
      where: { userId: Number(id) },
    });

    await prisma.file.deleteMany({
      where: { uploadedBy: Number(id) },
    });

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
