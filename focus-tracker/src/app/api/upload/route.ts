import { NextResponse } from "next/server";
import {
  isS3Configured,
  validateFileType,
  validateFileSize,
  generateFileKey,
  generatePresignedUploadUrl,
  getFileUrl,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/s3";
import {
  checkPermission,
  getRequestActor,
  unauthorizedResponse,
} from "@/lib/rbac";
import { detectSqliRisk, sanitizeInput } from "@/lib/security";

export async function POST(req: Request) {
  try {
    const actor = getRequestActor(req);
    if (!actor) {
      return unauthorizedResponse();
    }

    const canUpload = checkPermission({
      actor,
      permission: "upload_files",
      resource: "uploads",
      action: "create_presigned_url",
      targetUserId: actor.userId,
      allowOwner: true,
    });

    if (!canUpload) {
      return NextResponse.json(
        { success: false, message: "Access denied: insufficient permissions" },
        { status: 403 }
      );
    }

    // Check if S3 is configured
    if (!isS3Configured()) {
      return NextResponse.json(
        {
          success: false,
          message: "File upload service not configured. Please set AWS credentials.",
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { filename, fileType, fileSize, userId } = body;
    const cleanFilename = sanitizeInput(filename);
    const cleanFileType = sanitizeInput(fileType);
    const effectiveUserId = actor.role === "admin" && userId ? userId : actor.userId;

    // Validate required fields
    if (!cleanFilename || !cleanFileType) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: filename and fileType are required",
        },
        { status: 400 }
      );
    }

    if ([cleanFilename, cleanFileType].some(detectSqliRisk)) {
      return NextResponse.json(
        { success: false, message: "Input rejected by security policy" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateFileType(cleanFileType)) {
      return NextResponse.json(
        {
          success: false,
          message: `Unsupported file type. Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate file size if provided
    if (fileSize && !validateFileSize(fileSize)) {
      return NextResponse.json(
        {
          success: false,
          message: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        },
        { status: 400 }
      );
    }

    // Generate unique file key
    const key = generateFileKey(cleanFilename, effectiveUserId);

    // Generate pre-signed URL (expires in 60 seconds)
    const uploadUrl = await generatePresignedUploadUrl(key, cleanFileType, 60);

    if (!uploadUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate upload URL",
        },
        { status: 500 }
      );
    }

    // Get the final file URL (after upload completes)
    const fileUrl = getFileUrl(key);

    return NextResponse.json({
      success: true,
      uploadUrl,
      key,
      fileUrl,
      expiresIn: 60, // seconds
    });
  } catch (error) {
    console.error("Upload URL generation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate pre-signed URL",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to return upload configuration
export async function GET() {
  return NextResponse.json({
    success: true,
    configured: isS3Configured(),
    allowedTypes: ALLOWED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxSizeMB: MAX_FILE_SIZE / (1024 * 1024),
  });
}
