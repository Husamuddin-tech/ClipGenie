import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 
                shadow-[0_0_15px_rgba(150,150,255,0.15)] hover:shadow-[0_0_25px_rgba(150,150,255,0.25)]
                transition-all duration-300 overflow-hidden">
  
  <figure className="relative px-4 pt-4">
    <Link href={`/videos/${video._id}`} className="relative group w-full">
      <div
        className="rounded-xl overflow-hidden relative w-full shadow-[0_0_10px_rgba(0,0,0,0.05)]"
        style={{ aspectRatio: "9/16" }}
      >
        <IKVideo
          path={video.videoUrl}
          transformation={[
            { height: "1920", width: "1080" },
          ]}
          controls={video.controls}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    </Link>
  </figure>

  <div className="p-4 flex flex-col gap-2">
    <Link
      href={`/videos/${video._id}`}
      className="hover:opacity-90 transition-opacity"
    >
      <h2 className="text-lg font-semibold text-purple-700">{video.title}</h2>
    </Link>

    <p className="text-sm text-purple-600/70 line-clamp-2">
      {video.description}
    </p>
  </div>
</div>

  );
}