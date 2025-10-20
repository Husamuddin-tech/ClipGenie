'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { LoaderCircle } from 'lucide-react';
import { useNotification } from './Notification';
import { apiClient } from '@/lib/api-client';
import FileUpload, { UploadResponse } from './FileUpload';

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  tags: string; // comma-separated tags
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
      tags: '',
    },
  });

  const handleUploadSuccess = (response: UploadResponse) => {
    setValue('videoUrl', response.url);
    setValue('thumbnailUrl', response.url || response.url);
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
      // Convert comma-separated tags to array
      const tagsArray =
        data.tags
          ?.split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag) || [];

      await apiClient.createVideo({
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        tags: tagsArray,
      });

      showNotification('Video published successfully!', 'success');

      // Reset form after successful submission
      setValue('title', '');
      setValue('description', '');
      setValue('videoUrl', '');
      setValue('thumbnailUrl', '');
      setValue('tags', '');
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
      className="space-y-6 p-6 rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 shadow-[0_0_20px_rgba(150,150,255,0.15)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(150,150,255,0.25)]"
    >
      {/* Title */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-purple-700">Title</label>
        <input
          type="text"
          className={`px-4 py-2 rounded-2xl border-2 text-pink-400 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent focus:scale-105 focus:shadow-[0_0_12px_rgba(255,182,193,0.3)]
        ${
          errors.title
            ? 'border-red-300 bg-red-50'
            : 'border-transparent bg-white/80 hover:bg-white/90'
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
          className={`px-4 py-2 rounded-2xl h-24 border-2 text-pink-400 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent focus:scale-105 focus:shadow-[0_0_12px_rgba(186,150,255,0.3)]
        ${
          errors.description
            ? 'border-red-300 bg-red-50'
            : 'border-transparent bg-white/80 hover:bg-white/90'
        }`}
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <span className="text-red-600 text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-purple-700">
          Tags (comma separated)
        </label>
        <input
          type="text"
          placeholder="e.g. Music, Vlog, Tutorial"
          className="px-4 py-2 rounded-2xl border-2 border-transparent bg-white/80 text-purple-700 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent focus:scale-105 focus:shadow-[0_0_12px_rgba(173,216,230,0.3)]
        hover:bg-white/90"
          {...register('tags')}
        />
      </div>

      {/* Video Upload */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-purple-700">Upload Video</label>
        <FileUpload
          fileType="video"
          onSuccess={handleUploadSuccess}
          onProgress={handleUploadProgress}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full px-5 py-3 rounded-2xl font-semibold text-white shadow-[0_0_12px_rgba(255,182,193,0.4)]
      transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,182,193,0.6)] hover:scale-105
      ${
        loading || !uploadProgress
          ? 'bg-pink-200 cursor-not-allowed'
          : 'bg-pink-400 hover:bg-pink-500'
      }`}
        disabled={loading || !uploadProgress}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <LoaderCircle className="w-5 h-5 animate-spin" />
            Publishing Video...
          </div>
        ) : (
          'Publish Video'
        )}
      </button>
    </form>
  );
}
