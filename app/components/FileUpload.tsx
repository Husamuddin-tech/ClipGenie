'use client';

import { IKUpload } from 'imagekitio-next';
import { IKUploadResponse } from 'imagekitio-next/dist/types/components/IKUpload/props';
import { useState } from 'react';
// import { LoaderCircle } from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: 'image' | 'video';
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = 'image',
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
    if (fileType === 'video') {
      if (!file.type.startsWith('video/')) {
        setError('⚠️ Please upload a valid video🎥 file');
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError('📹 Video size must be less than 100MB 📏');
        return false;
      }
    } else {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image 📸 file (JPEG, PNG, or WebP)❗');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File📁 size must be less than 5MB ⚠️ ');
        return false;
      }
    }
    return true;
  };

  return (
    <div className="space-y-4 p-5 rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 shadow-[0_0_20px_rgba(150,150,255,0.15)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(150,150,255,0.25)]">
      <IKUpload
        fileName={fileType === 'video' ? 'video' : 'image'}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handleStartUpload}
        onUploadProgress={handleProgress}
        accept={fileType === 'video' ? 'video/*' : 'image/*'}
        className="file-input file-input-bordered w-full border-2 border-transparent bg-white/80 rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 hover:bg-white/90 hover:shadow-[0_0_10px_rgba(255,182,193,0.4)]"
        validateFile={validateFile}
        useUniqueFileName={true}
        folder={fileType === 'video' ? '/videos' : '/images'}
      />

      {/* Funky Bouncing Blobs Loader */}
      {uploading && (
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="blob bg-pink-400"></span>
          <span className="blob bg-purple-400"></span>
          <span className="blob bg-blue-400"></span>
          <span className="text-sm text-gray-700 font-semibold animate-pulse ml-2">
            Uploading {fileType}...
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-2xl text-sm shadow-[0_0_15px_rgba(255,100,100,0.1)] animate-shake">
          {error}
        </div>
      )}
    </div>
  );
}
