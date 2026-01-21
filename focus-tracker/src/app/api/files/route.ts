import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/s3";

// GET - List all files (with optional filtering by user)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where = userId ? { uploadedBy: parseInt(userId) } : {};

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
    const body = await req.json();
    const { name, key, url, fileType, size, uploadedBy } = body;

    // Validate required fields
    if (!name || !key || !url || !fileType) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: name, key, url, and fileType are required",
        },
        { status: 400 }
      );
    }

    // Check if file with this key already exists
    const existingFile = await prisma.file.findUnique({
      where: { key },
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
        name,
        key,
        url,
        fileType,
        size: size || null,
        uploadedBy: uploadedBy || null,
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "File ID is required" },
        { status: 400 }
      );
    }

    // Find the file
    const file = await prisma.file.findUnique({
      where: { id: parseInt(id) },
    });

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    // Delete from S3
    await deleteFile(file.key);

    // Delete from database
    await prisma.file.delete({
      where: { id: parseInt(id) },
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
