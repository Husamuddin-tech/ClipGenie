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
        <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-700 text-center sm:text-left">
          ClipGenie
        </h1>

        {/* Info / Description */}
        <p className="text-center sm:text-left text-purple-700/80 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto sm:mx-0">
          Flex your videography skills and share your amazing clips—any email
          will do! 🎬✨
        </p>

        {/* Pro Tip Warning */}
        <div className="max-w-3xl mx-auto sm:mx-0 flex items-center gap-2 px-4 py-2 bg-yellow-100 border-l-4 border-yellow-400 rounded-lg text-yellow-800 font-medium shadow-sm">
          <span>⚠️</span>
          <span>
            Pro tip: Keep it safe—don’t post personal info or sensitive videos.
            Stay creative, stay secure!
          </span>
        </div>

        {/* Video Feed Card (spaced more down) */}
        <div className="mt-6 rounded-3xl p-6 bg-white/90 shadow-[0_0_25px_rgba(150,150,255,0.2)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_35px_rgba(150,150,255,0.25)]">
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
