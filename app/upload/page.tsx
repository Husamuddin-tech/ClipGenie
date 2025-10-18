'use client';

import VideoUploadForm from '../components/VideoUploadForm';

export default function VideoUploadPage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 
                backdrop-blur-sm py-12 px-4 transition-all duration-300"
    >
      <div className="max-w-2xl mx-auto rounded-2xl bg-white/80 shadow-[0_0_20px_rgba(150,150,255,0.15)] p-8 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-8 text-center sm:text-left">
          Upload New Clip
        </h1>

        <VideoUploadForm />
      </div>
    </div>
  );
}
