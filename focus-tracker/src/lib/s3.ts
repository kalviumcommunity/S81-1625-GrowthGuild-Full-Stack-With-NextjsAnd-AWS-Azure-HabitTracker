import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Allowed file types and max file size
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// S3 Client configuration
let s3Client: S3Client | null = null;

const getS3Client = (): S3Client | null => {
  if (s3Client) return s3Client;

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;

  if (!accessKeyId || !secretAccessKey || !region) {
    console.warn("⚠️ AWS credentials not configured - file uploads disabled");
    return null;
  }

  s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return s3Client;
};

// Check if S3 is configured
export const isS3Configured = (): boolean => {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.AWS_BUCKET_NAME
  );
};

// Validate file type
export const validateFileType = (fileType: string): boolean => {
  return ALLOWED_FILE_TYPES.includes(fileType);
};

// Validate file size
export const validateFileSize = (size: number): boolean => {
  return size <= MAX_FILE_SIZE;
};

// Generate a unique file key with timestamp and random string
export const generateFileKey = (filename: string, userId?: number): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const folder = userId ? `users/${userId}` : "uploads";
  return `${folder}/${timestamp}-${randomStr}-${sanitizedFilename}`;
};

// Generate pre-signed URL for upload
export const generatePresignedUploadUrl = async (
  key: string,
  contentType: string,
  expiresIn: number = 60 // 60 seconds default
): Promise<string | null> => {
  const client = getS3Client();
  const bucketName = process.env.AWS_BUCKET_NAME;

  if (!client || !bucketName) {
    return null;
  }

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error("Failed to generate pre-signed URL:", error);
    return null;
  }
};

// Get the public URL for an uploaded file
export const getFileUrl = (key: string): string => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

// Delete a file from S3
export const deleteFile = async (key: string): Promise<boolean> => {
  const client = getS3Client();
  const bucketName = process.env.AWS_BUCKET_NAME;

  if (!client || !bucketName) {
    return false;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await client.send(command);
    return true;
  } catch (error) {
    console.error("Failed to delete file from S3:", error);
    return false;
  }
};
