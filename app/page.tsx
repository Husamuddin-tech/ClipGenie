'use client';

import React, { useEffect, useState } from 'react';
import VideoFeed from './components/VideoFeed';
import { IVideo } from '@/models/Video';
import { apiClient } from '@/lib/api-client';

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  // Fetch all videos
  const fetchVideos = async () => {
    try {
      const data = await apiClient.getVideos();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // 🗑️ Update state when a video is deleted
  const handleVideoDeleted = (id: string) => {
    setVideos((prev) => prev.filter((video) => video._id?.toString() !== id));
  };

  // ✏️ Update state when a video is edited
  const handleVideoEdited = (updatedVideo: IVideo) => {
    setVideos((prev) =>
      prev.map((video) =>
        video._id === updatedVideo._id ? updatedVideo : video
      )
    );
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 
             backdrop-blur-sm py-12 px-4 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-700 text-center sm:text-left drop-shadow-sm">
          ClipGenie
        </h1>

        {/* Info / Description */}
        <p className="text-center sm:text-left text-purple-700/80 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto sm:mx-0">
          Flex your videography skills and share your amazing clips—any email
          will do! 🎬✨
        </p>

        {/* Warnings Section */}
        <div className="max-w-3xl mx-auto sm:mx-0 flex flex-col gap-4 mt-6">
          {/* Pro Tip */}
          <div
            className="flex items-start sm:items-center gap-3 px-5 py-4 
                  bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-400 
                  border-l-8 border-yellow-500 rounded-xl shadow-md"
          >
            <span className="text-2xl animate-pulse">⚠️</span>
            <div className="text-yellow-900 font-semibold leading-relaxed">
              <span className="block text-lg font-extrabold uppercase tracking-wide">
                Pro Tip
              </span>
              <span className="block text-sm sm:text-base font-medium">
                Keep it safe—don’t post personal info or sensitive videos. Stay
                creative, stay secure!
              </span>
            </div>
          </div>
          {/* Important Notice */}
          <div
            className="flex items-start sm:items-center gap-3 px-5 py-4 
                  bg-gradient-to-r from-orange-100 via-orange-200 to-red-200 
                  border-l-8 border-red-500 rounded-xl shadow-md"
          >
            <span className="text-2xl animate-bounce">🚧</span>
            <div className="text-red-900 font-semibold leading-relaxed">
              <span className="block text-lg font-extrabold uppercase tracking-wide">
                Important Notice
              </span>
              <span className="block text-sm sm:text-base font-medium">
                This website is fully optimized for desktop use. On other
                devices, some features may not function properly or could cause
                bugs.
              </span>
            </div>
          </div>
        </div>

        {/* Video Feed Card */}
        <div className="mt-10 rounded-3xl p-6 bg-white/90 shadow-[0_0_25px_rgba(150,150,255,0.2)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_35px_rgba(150,150,255,0.25)]">
          <VideoFeed
            videos={videos}
            onVideoDeleted={handleVideoDeleted}
            onVideoEdited={handleVideoEdited}
          />
        </div>
      </div>
    </main>
  );
}
