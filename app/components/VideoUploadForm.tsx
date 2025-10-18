'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IKUploadResponse } from 'imagekitio-next/dist/types/components/IKUpload/props';
import { LoaderCircle } from 'lucide-react';
import { useNotification } from './Notification';
import { apiClient } from '@/lib/api-client';
import FileUpload from './FileUpload';

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
    },
  });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue('videoUrl', response.filePath);
    setValue('thumbnailUrl', response.thumbnailUrl || response.filePath);
    showNotification('Video uploaded successfully!', 'success');
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) {
      showNotification('Please upload a video first', 'error');
      return;
    }

    setLoading(true);
    try {
      await apiClient.createVideo(data);
      showNotification('Video published successfully!', 'success');

      // Reset form after successful submission
      setValue('title', '');
      setValue('description', '');
      setValue('videoUrl', '');
      setValue('thumbnailUrl', '');
      setUploadProgress(0);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : 'Failed to publish video',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 shadow-[0_0_15px_rgba(150,150,255,0.15)] transition-all duration-300"
    >
      {/* Title */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-purple-700">Title</label>
        <input
          type="text"
          className={`px-4 py-2 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 
                  ${
                    errors.title
                      ? 'border-red-300 bg-red-50'
                      : 'border-transparent bg-white/70'
                  }`}
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <span className="text-red-600 text-sm mt-1">
            {errors.title.message}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-purple-700">Description</label>
        <textarea
          className={`px-4 py-2 rounded-xl h-24 border-2 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-200 
                  ${
                    errors.description
                      ? 'border-red-300 bg-red-50'
                      : 'border-transparent bg-white/70'
                  }`}
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <span className="text-red-600 text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* Video Upload */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-purple-700">Upload Video</label>
        <FileUpload
          fileType="video"
          onSuccess={handleUploadSuccess}
          onProgress={handleUploadProgress}
        />
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-pink-300 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full px-4 py-3 rounded-xl font-semibold text-white shadow-[0_0_10px_rgba(255,182,193,0.4)] 
                transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,182,193,0.6)] 
                ${
                  loading || !uploadProgress
                    ? 'bg-pink-200 cursor-not-allowed'
                    : 'bg-pink-400 hover:bg-pink-500'
                }`}
        disabled={loading || !uploadProgress}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <LoaderCircle className="w-4 h-4 animate-spin" />
            Publishing Video...
          </div>
        ) : (
          'Publish Video'
        )}
      </button>
    </form>
  );
}
