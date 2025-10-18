'use client';

import React, { useEffect, useState } from 'react';
import VideoFeed from './components/VideoFeed';
import { IVideo } from '@/models/Video';
import { apiClient } from '@/lib/api-client';

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 
                 backdrop-blur-sm py-12 px-4 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-700 mb-8 text-center sm:text-left">
          ClipGenie
        </h1>

        <div className="rounded-2xl p-4 bg-white/80 shadow-[0_0_20px_rgba(150,150,255,0.15)] transition-all duration-300">
          <VideoFeed videos={videos} />
        </div>
      </div>
    </main>
  );
}
