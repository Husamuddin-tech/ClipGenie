import { IVideo } from '@/models/Video';
import VideoComponent from './VideoComponent';

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {videos.map((video) => (
        <VideoComponent key={video._id?.toString()} video={video} />
      ))}

      {videos.length === 0 && (
        <div
          className="col-span-full text-center py-12 rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 
                    shadow-[0_0_15px_rgba(150,150,255,0.1)]"
        >
          <p className="text-purple-600/70 font-medium text-lg">
            No videos found
          </p>
        </div>
      )}
    </div>
  );
}
