'use client';

import { upload } from '@imagekit/next';
import { useState } from 'react';

// import { IKUpload } from 'imagekitio-next'; old
// import { IKUploadResponse } from 'imagekitio-next/dist/types/components/IKUpload/props'; old
// import { LoaderCircle } from "lucide-react";

interface UploadResponse {
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
      const authRes = await fetch('/api/auth/imagekit-auth');
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
    <div className="space-y-4 p-5 rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 shadow-[0_0_20px_rgba(150,150,255,0.15)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(150,150,255,0.25)]">
      <input
        type="file"
        accept={fileType === 'video' ? 'video/*' : 'image/*'}
        onChange={handleFileChange}
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
