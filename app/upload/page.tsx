'use client';

import VideoUploadForm from '../components/VideoUploadForm';

export default function VideoUploadPage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50
             backdrop-blur-md flex items-center justify-center py-12 px-6 sm:px-10
             transition-all duration-500"
    >
      <div
        className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl
               shadow-[0_0_25px_rgba(150,150,255,0.15)] hover:shadow-[0_0_35px_rgba(150,150,255,0.25)]
               border border-white/40 p-8 sm:p-10 transition-all duration-500 transform hover:-translate-y-1"
      >
        <div className="text-center sm:text-left">
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text
                   bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600
                   drop-shadow-sm mb-8 tracking-tight"
          >
            Upload New Clip
          </h1>
        </div>

        <div className="relative group">
          <div
            className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300
                   opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500"
          ></div>
          <div className="relative z-10">
            <VideoUploadForm />
          </div>
        </div>
      </div>
    </div>
  );
}
