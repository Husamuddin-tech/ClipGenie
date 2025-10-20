import { IVideo } from '@/models/Video';
import VideoComponent from './VideoComponent';

interface VideoFeedProps {
  videos: IVideo[];
  onVideoDeleted?: (id: string) => void;
  onVideoEdited?: (updatedVideo: IVideo) => void;
}

export default function VideoFeed({
  videos,
  onVideoDeleted,
  onVideoEdited,
}: VideoFeedProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {videos.map((video) => (
        <VideoComponent
          key={video._id?.toString()}
          video={video}
          onVideoDeleted={onVideoDeleted}
          onVideoEdited={onVideoEdited}
        />
      ))}

      {videos.length === 0 && (
        <div
          className="col-span-full flex flex-col items-center justify-center py-16 rounded-3xl
                 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50
                 shadow-[0_0_20px_rgba(150,150,255,0.15)]
                 animate-fade-in
                 transition-all duration-500"
        >
          <span className="text-6xl mb-4 animate-bounce">📭</span>
          <p className="text-purple-600/80 font-semibold text-lg sm:text-xl">
            No videos found
          </p>
          <p className="text-purple-500/60 text-sm sm:text-base mt-2">
            Upload your first video to get started!
          </p>
        </div>
      )}
    </div>
  );
}
