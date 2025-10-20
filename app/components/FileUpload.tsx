'use client';

import { upload } from '@imagekit/next';
import { useState } from 'react';

export interface UploadResponse {
  url: string;
  fileName: string;
  size: number;
  type: string;
}
interface FileUploadProps {
  onSuccess: (res: UploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: 'image' | 'video';
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //optional validation

  const validateFile = (file: File) => {
    if (fileType === 'video') {
      if (!file.type.startsWith('video/')) {
        setError('Please upload a valid video file');
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100 MB');
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch('/api/imagekit-auth');
      const auth = await authRes.json();

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });
      // Map ImageKit's response to our UploadResponse type
      const mappedRes: UploadResponse = {
        url: res.url!,
        fileName: file.name, // set from the original file
        size: file.size, // set from the original file
        type: file.type, // set from the original file
      };
      onSuccess(mappedRes);
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 shadow-[0_0_20px_rgba(150,150,255,0.15)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_35px_rgba(150,150,255,0.25)] sm:max-w-lg md:max-w-xl">
      {/* Upload Input */}
      <label
        htmlFor="file-upload"
        className="block w-full cursor-pointer border-2 border-dashed border-purple-300 rounded-2xl py-10 text-center hover:border-purple-400 hover:bg-white/40 transition-all duration-300"
      >
        <input
          id="file-upload"
          type="file"
          accept={fileType === 'video' ? 'video/*' : 'image/*'}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <svg
            className="w-10 h-10 text-purple-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 15a4 4 0 014-4h1a4 4 0 014 4v5m4 0v-5a4 4 0 014-4h1a4 4 0 014 4v5m-9-7V3m0 0l-3.5 3.5M12 3l3.5 3.5"
            />
          </svg>
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Click or drag & drop your {fileType} file here
          </p>
          <p className="text-xs text-gray-500">
            Supported formats:{' '}
            {fileType === 'video' ? 'MP4, MOV, AVI' : 'JPG, PNG, WEBP'}
          </p>
        </div>
      </label>

      {/* Funky Bouncing Blobs Loader */}
      {uploading && (
        <div className="flex items-center justify-center gap-3 mt-4 sm:mt-5">
          <span className="blob bg-pink-400"></span>
          <span className="blob bg-purple-400"></span>
          <span className="blob bg-blue-400"></span>
          <span className="text-sm sm:text-base text-gray-700 font-semibold animate-pulse ml-2">
            Uploading {fileType}...
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl text-sm sm:text-base shadow-[0_0_15px_rgba(255,100,100,0.1)] animate-shake">
          {error}
        </div>
      )}
    </div>
  );
}
