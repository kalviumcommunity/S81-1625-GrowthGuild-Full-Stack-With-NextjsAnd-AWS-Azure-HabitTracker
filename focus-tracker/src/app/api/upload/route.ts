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

export async function POST(req: Request) {
  try {
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

    // Validate required fields
    if (!filename || !fileType) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: filename and fileType are required",
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateFileType(fileType)) {
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
    const key = generateFileKey(filename, userId);

    // Generate pre-signed URL (expires in 60 seconds)
    const uploadUrl = await generatePresignedUploadUrl(key, fileType, 60);

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
