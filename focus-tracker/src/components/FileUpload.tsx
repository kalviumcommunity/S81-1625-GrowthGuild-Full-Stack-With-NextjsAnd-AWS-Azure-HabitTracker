"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UploadConfig {
  allowedTypes: string[];
  maxSize: number;
  maxSizeMB: number;
  configured: boolean;
}

interface UploadedFile {
  id: number;
  name: string;
  key: string;
  url: string;
  fileType: string;
  size: number | null;
  createdAt: string;
}

interface FileUploadProps {
  userId?: number;
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: string) => void;
}

export default function FileUpload({
  userId,
  onUploadComplete,
  onUploadError,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [config, setConfig] = useState<UploadConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch upload configuration on mount
  const fetchConfig = useCallback(async () => {
    try {
      setConfigLoading(true);
      const res = await fetch("/api/upload");
      const data = await res.json();
      if (data.success) {
        setConfig(data);
      } else {
        setConfig({ configured: false, allowedTypes: [], maxSize: 0, maxSizeMB: 0 });
      }
    } catch {
      setConfig({ configured: false, allowedTypes: [], maxSize: 0, maxSizeMB: 0 });
    } finally {
      setConfigLoading(false);
    }
  }, []);

  // Fetch config on first render
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const resetState = () => {
    setError(null);
    setSuccess(null);
    setProgress(0);
  };

  const uploadFile = async (file: File) => {
    resetState();
    setUploading(true);

    try {
      // Step 1: Request pre-signed URL
      setProgress(10);
      const urlRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          fileType: file.type,
          fileSize: file.size,
          userId,
        }),
      });

      const urlData = await urlRes.json();

      if (!urlData.success) {
        throw new Error(urlData.message || "Failed to get upload URL");
      }

      setProgress(30);

      // Step 2: Upload file directly to S3 using pre-signed URL
      const uploadRes = await fetch(urlData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to storage");
      }

      setProgress(70);

      // Step 3: Store file metadata in database
      const metadataRes = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          key: urlData.key,
          url: urlData.fileUrl,
          fileType: file.type,
          size: file.size,
          uploadedBy: userId,
        }),
      });

      const metadataData = await metadataRes.json();

      if (!metadataData.success) {
        throw new Error(metadataData.message || "Failed to save file metadata");
      }

      setProgress(100);
      setSuccess(`Successfully uploaded: ${file.name}`);
      onUploadComplete?.(metadataData.file);

      // Reset after success
      setTimeout(() => {
        setProgress(0);
        setSuccess(null);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Loading State */}
      {configLoading && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-500">Checking upload configuration...</p>
        </div>
      )}

      {/* S3 Not Configured Warning */}
      {!configLoading && config && !config.configured && (
        <div className="border-2 border-dashed border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-8 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
            AWS S3 Not Configured
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
            File uploads require AWS S3 credentials to be configured.
          </p>
          <div className="text-left bg-white dark:bg-gray-800 rounded-xl p-4 text-sm">
            <p className="font-medium text-gray-700 dark:text-gray-200 mb-2">Add these to your <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.env</code> file:</p>
            <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto">
{`AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your-bucket-name`}
            </pre>
          </div>
        </div>
      )}

      {/* Drop Zone - Only show when S3 is configured */}
      {!configLoading && config?.configured && (
        <div
          className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center
            transition-all duration-300 cursor-pointer
            ${dragActive
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800"
            }
            ${uploading ? "pointer-events-none opacity-70" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept={config?.allowedTypes.join(",")}
            disabled={uploading}
          />

          {/* Upload Icon */}
          <div className="mb-4">
            <svg
              className={`w-16 h-16 mx-auto transition-colors ${
                dragActive ? "text-primary" : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            {dragActive ? "Drop your file here" : "Drag & drop your file"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            or click to browse
          </p>

          {config && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Max size: {config.maxSizeMB}MB • Supported: Images, PDF, Word docs
            </p>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Uploading...
            </span>
            <span className="text-sm font-medium text-primary">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
          </div>
        </div>
      )}

      {/* Upload Tips - Only show when S3 is configured */}
      {!configLoading && config?.configured && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
            📌 Upload Tips
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Files are uploaded directly to cloud storage (S3)</li>
            <li>• Upload URLs expire in 60 seconds for security</li>
            <li>• Your credentials never touch the upload stream</li>
          </ul>
        </div>
      )}
    </div>
  );
}
