import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/s3";
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

// GET - List all files (with optional filtering by user)
export async function GET(req: Request) {
  try {
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

    const canReadFiles = checkPermission({
      actor,
      permission: "read_files",
      resource: "files",
      action: "list",
    });

    if (!canReadFiles) {
      return NextResponse.json(
        { success: false, message: "Access denied: insufficient permissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const limit = parseSafeInt(searchParams.get("limit"), 50);
    const offset = parseSafeInt(searchParams.get("offset"), 0);

    const requestedUserId = userId ? parseSafeInt(userId, actor.userId) : actor.userId;
    const effectiveUserId = actor.role === "admin" ? requestedUserId : actor.userId;
    const where = { uploadedBy: effectiveUserId };

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.file.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      files,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + files.length < total,
      },
    });
  } catch (error) {
    console.error("Failed to fetch files:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

// POST - Store file metadata after successful upload
export async function POST(req: Request) {
  try {
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

    const canUploadFiles = checkPermission({
      actor,
      permission: "upload_files",
      resource: "files",
      action: "create_metadata",
      targetUserId: actor.userId,
      allowOwner: true,
    });

    if (!canUploadFiles) {
      return NextResponse.json(
        { success: false, message: "Access denied: insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, key, url, fileType, size, uploadedBy } = body;
    const cleanName = sanitizeInput(name);
    const cleanKey = sanitizeInput(key);
    const cleanUrl = sanitizeInput(url);
    const cleanFileType = sanitizeInput(fileType);
    const effectiveUploadedBy = actor.role === "admin" && uploadedBy ? uploadedBy : actor.userId;

    // Validate required fields
    if (!cleanName || !cleanKey || !cleanUrl || !cleanFileType) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: name, key, url, and fileType are required",
        },
        { status: 400 }
      );
    }

    if ([cleanName, cleanKey, cleanUrl, cleanFileType].some(detectSqliRisk)) {
      return NextResponse.json(
        { success: false, message: "Input rejected by security policy" },
        { status: 400 }
      );
    }

    // Check if file with this key already exists
    const existingFile = await prisma.file.findUnique({
      where: { key: cleanKey },
    });

    if (existingFile) {
      return NextResponse.json(
        { success: false, message: "File with this key already exists" },
        { status: 409 }
      );
    }

    // Create file record
    const file = await prisma.file.create({
      data: {
        name: cleanName,
        key: cleanKey,
        url: cleanUrl,
        fileType: cleanFileType,
        size: size || null,
        uploadedBy: effectiveUploadedBy,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "File metadata stored successfully",
      file,
    });
  } catch (error) {
    console.error("Failed to store file metadata:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to store file metadata",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a file by ID
export async function DELETE(req: Request) {
  try {
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "File ID is required" },
        { status: 400 }
      );
    }

    // Find the file
    const parsedId = parseSafeInt(id, 0);
    const file = await prisma.file.findUnique({
      where: { id: parsedId },
    });

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    const canDeleteAnyFile = checkPermission({
      actor,
      permission: "delete_any_file",
      resource: "files",
      action: "delete",
      targetUserId: file.uploadedBy || undefined,
    });

    const canDeleteOwnFile = checkPermission({
      actor,
      permission: "delete_own_file",
      resource: "files",
      action: "delete",
      targetUserId: file.uploadedBy || undefined,
      allowOwner: true,
    });

    if (!canDeleteAnyFile && !canDeleteOwnFile) {
      return NextResponse.json(
        { success: false, message: "Access denied: insufficient permissions" },
        { status: 403 }
      );
    }

    // Delete from S3
    await deleteFile(file.key);

    // Delete from database
    await prisma.file.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete file:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete file" },
      { status: 500 }
    );
  }
}
