"use client";

import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (err: { message: string }) => {
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("⚠️ Please upload a valid video🎥 file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("📹 Video size must be less than 100MB 📏");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image 📸 file (JPEG, PNG, or WebP)❗");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File📁 size must be less than 5MB ⚠️ ");
        return false;
      }
    }
    return true;
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 shadow-[0_0_15px_rgba(150,150,255,0.15)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(150,150,255,0.25)]">
  <IKUpload
    fileName={fileType === "video" ? "video" : "image"}
    onError={onError}
    onSuccess={handleSuccess}
    onUploadStart={handleStartUpload}
    onUploadProgress={handleProgress}
    accept={fileType === "video" ? "video/*" : "image/*"}
    className="file-input file-input-bordered w-full border-2 border-transparent bg-white/70 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 hover:bg-white/90 hover:shadow-[0_0_8px_rgba(255,182,193,0.4)]"
    validateFile={validateFile}
    useUniqueFileName={true}
    folder={fileType === "video" ? "/videos" : "/images"}
  />

  {uploading && (
    <div className="flex items-center gap-2 text-sm text-pink-600 font-medium">
      <LoaderCircle className="w-4 h-4 animate-spin text-pink-500" />
      <span>📤 Uploading...</span>
    </div>
  )}

  {error && (
    <div className="text-red-500 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg text-sm shadow-[0_0_10px_rgba(255,100,100,0.1)]">
      {error}
    </div>
  )}
</div>

  );
}