'use client';

// import { IKVideo } from 'imagekitio-next';
import Link from 'next/link';
import { IVideo } from '@/models/Video';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useNotification } from './Notification';
import { useSession } from 'next-auth/react';
import { Video } from '@imagekit/next';

interface VideoComponentProps {
  video: IVideo;
  onVideoDeleted?: (id: string) => void;
  onVideoEdited?: (updatedVideo: IVideo) => void;
}

export default function VideoComponent({
  video,
  onVideoDeleted,
  onVideoEdited,
}: VideoComponentProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { showNotification } = useNotification();

  const isOwner =
    !!session?.user?.id && video.owner?._id?.toString() === session.user.id;

  // Delete handlers
  const handleDeleteClick = () => setShowConfirmDelete(true);
  const handleDeleteConfirmed = async () => {
    setShowConfirmDelete(false);
    try {
      const res = await fetch(`/api/videos/${video._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete');
      showNotification('Video deleted successfully!', 'success');
      onVideoDeleted?.(video._id!.toString());
      router.refresh();
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : 'Error deleting video',
        'error'
      );
    }
  };

  // Edit handler
  const handleEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/videos/${video._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to update video');

      const updatedVideo: IVideo = await res.json();
      showNotification('Video updated successfully!', 'success');
      setIsEditing(false);
      onVideoEdited?.(updatedVideo);
      router.refresh();
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : 'Error updating video',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="group relative rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50
             shadow-[0_0_15px_rgba(150,150,255,0.15)] hover:shadow-[0_0_25px_rgba(150,150,255,0.25)]
             hover:scale-105 transition-all duration-300 overflow-hidden"
    >
      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl p-8 w-11/12 max-w-md shadow-lg scale-95 animate-scale-in space-y-4">
            <h3 className="font-bold text-xl text-purple-700 text-center">
              Confirm Delete
            </h3>
            <p className="text-center text-purple-600 text-sm leading-relaxed">
              Are you sure you want to delete this video? This action cannot be
              undone.
            </p>
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-purple-300 bg-white text-purple-700 hover:bg-purple-50 transition-colors font-medium"
                aria-label="Cancel delete"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium shadow-md"
                aria-label="Confirm delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Video Thumbnail with Overlay & Tags */}
      <figure className="relative p-2">
        <Link
          href={`/videos/${video._id}`}
          className="relative block group-hover:scale-[1.02] transition-transform duration-300"
          aria-label={`Go to video ${video.title}`}
        >
          <div className="rounded-xl p-1 bg-gradient-to-tr from-pink-300 via-purple-300 to-blue-300">
            <div
              className="relative rounded-xl overflow-hidden shadow-md aspect-video"
              style={{ aspectRatio: '9/16' }}
            >
              <Video
                src={video.videoUrl}
                transformation={[{ height: '1920', width: '1080' }]}
                controls={video.controls}
                className="w-full h-full object-cover rounded-xl"
              />

              {/* Overlay: Owner Info & Tags */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-1 backdrop-blur-sm p-1 rounded-lg">
                {video.owner && 'email' in video.owner && (
                  <span className="badge badge-sm badge-info max-w-[120px] truncate shadow-sm">
                    {video.owner.email}
                  </span>
                )}
                <div className="flex flex-wrap gap-1 mt-1">
                  {(Array.isArray(video.tags) ? video.tags : []).map((tag) => (
                    <span
                      key={tag}
                      className="badge badge-xs text-white px-2 py-1 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </figure>

      {/* Video Info */}
      <div className="p-4 flex flex-col gap-2">
        <Link href={`/videos/${video._id}`} className="group">
          <h2
            className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500
                     group-hover:underline transition-all duration-200"
          >
            {video.title}
          </h2>
        </Link>
        <p className="text-sm text-purple-600/70 line-clamp-2">
          {video.description}
        </p>

        {/* Action Buttons */}
        {isOwner && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-sm btn-info hover:scale-105 transition-transform duration-200"
              aria-label="Edit video"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="btn btn-sm btn-error hover:scale-105 transition-transform duration-200"
              aria-label="Delete video"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl p-8 w-11/12 max-w-md shadow-lg scale-95 animate-scale-in space-y-4">
            <h3 className="text-xl font-bold text-purple-700 text-center">
              Edit Video
            </h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="input input-bordered w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="textarea textarea-bordered w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300"
              rows={4}
            />
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-purple-300 bg-white text-purple-700 hover:bg-purple-50 transition-colors font-medium"
                aria-label="Cancel edit"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors font-medium shadow-md ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                aria-label="Save changes"
              >
                {loading ? 'Saving..' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 'use client';

// import { IKVideo } from 'imagekitio-next';
// import Link from 'next/link';
// import { IVideo } from '@/models/Video';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { useNotification } from './Notification';
// import { useSession } from 'next-auth/react';

// interface VideoComponentProps {
//   video: IVideo;
//   onVideoDeleted?: (id: string) => void;
//   onVideoEdited?: (updatedVideo: IVideo) => void;
// }

// export default function VideoComponent({
//   video,
//   onVideoDeleted,
//   onVideoEdited,
// }: VideoComponentProps) {
//   const router = useRouter();
//   const { data: session } = useSession();

//   const [isEditing, setIsEditing] = useState(false);
//   const [title, setTitle] = useState(video.title);
//   const [description, setDescription] = useState(video.description);
//   const [loading, setLoading] = useState(false);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);

//   const { showNotification } = useNotification();

//   // 🧠 Only show action buttons if user is logged in AND is owner
//   const isOwner =
//     !!session?.user?.id && video.owner?._id?.toString() === session.user.id;

//   // Show confirmation notification
//   const handleDeleteClick = () => setShowConfirmDelete(true);

//   // Actual delete call
//   const handleDeleteConfirmed = async () => {
//     setShowConfirmDelete(false);
//     try {
//       const res = await fetch(`/api/videos/${video._id}`, {
//         method: 'DELETE',
//         credentials: 'include',
//       });

//       if (!res.ok) throw new Error('Failed to delete');

//       showNotification('Video deleted successfully!', 'success');
//       onVideoDeleted?.(video._id!.toString());
//       router.refresh();
//     } catch (error) {
//       showNotification(
//         error instanceof Error ? error.message : 'Error deleting video',
//         'error'
//       );
//     }
//   };

//   // PATCH video
//   const handleEdit = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/videos/${video._id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ title, description }),
//         credentials: 'include',
//       });

//       if (!res.ok) throw new Error('Failed to update video');

//       const updatedVideo: IVideo = await res.json();
//       showNotification('Video updated successfully!', 'success');
//       setIsEditing(false);
//       onVideoEdited?.(updatedVideo);
//       router.refresh();
//     } catch (error) {
//       showNotification(
//         error instanceof Error ? error.message : 'Error updating video',
//         'error'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50
//                  shadow-[0_0_15px_rgba(150,150,255,0.15)] hover:shadow-[0_0_25px_rgba(150,150,255,0.25)]
//                  transition-all duration-300 overflow-hidden relative"
//     >
//       {/* Confirmation Notification */}
//       {showConfirmDelete && (
//         <div
//           className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] sm:w-96 bg-gradient-to-r from-pink-200 via-pink-100 to-pink-200
//                   border border-pink-300 text-pink-900 rounded-2xl shadow-lg p-4 flex justify-between items-center z-50
//                   animate-slide-down fade-in transition-all duration-300"
//         >
//           <span className="font-medium">
//             Are you sure you want to delete this video?
//           </span>
//           <div className="flex gap-2">
//             <button
//               onClick={handleDeleteConfirmed}
//               className="px-4 py-2 bg-red-400 text-white rounded-xl shadow hover:bg-red-500 hover:scale-105 transition-transform duration-200"
//             >
//               Yes
//             </button>
//             <button
//               onClick={() => setShowConfirmDelete(false)}
//               className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl shadow hover:bg-gray-400 hover:scale-105 transition-transform duration-200"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Video Thumbnail */}
//       <figure className="relative px-4 pt-4">
//         <Link href={`/videos/${video._id}`} className="relative group w-full">
//           <div
//             className="rounded-xl overflow-hidden relative w-full shadow-[0_0_10px_rgba(0,0,0,0.05)]"
//             style={{ aspectRatio: '9/16' }}
//           >
//             <IKVideo
//               path={video.videoUrl}
//               transformation={[{ height: '1920', width: '1080' }]}
//               controls={video.controls}
//               className="w-full h-full object-cover rounded-xl"
//             />
//           </div>
//         </Link>
//       </figure>

//       {/* Video Info */}
//       <div className="p-4 flex flex-col gap-2">
//         <Link
//           href={`/videos/${video._id}`}
//           className="hover:opacity-90 transition-opacity"
//         >
//           <h2 className="text-lg font-semibold text-purple-700">
//             {video.title}
//           </h2>
//         </Link>
//         <p className="text-sm text-purple-600/70 line-clamp-2">
//           {video.description}
//         </p>

//         {/* Action Buttons (Visible only to owner) */}
//         {isOwner && (
//           <div className="mt-3 flex gap-2">
//             <button
//               onClick={() => setIsEditing(true)}
//               className="px-3 py-1 bg-blue-300 text-white rounded-xl shadow hover:bg-blue-400 transition-all duration-200"
//             >
//               Edit
//             </button>
//             <button
//               onClick={handleDeleteClick}
//               className="px-3 py-1 bg-red-300 text-white rounded-xl shadow hover:bg-red-400 transition-all duration-200"
//             >
//               Delete
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Edit Modal */}
//       {isEditing && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-6 w-11/12 max-w-md shadow-[0_0_25px_rgba(150,150,255,0.25)] relative transition-all duration-300">
//             <h3 className="text-lg font-semibold mb-4 text-purple-700">
//               Edit Video
//             </h3>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Title"
//               className="w-full mb-3 p-2 rounded-xl border-2 border-transparent bg-white/70 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200 text-purple-700"
//             />
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Description"
//               className="w-full p-2 rounded-xl border-2 border-transparent bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200 mb-4 text-purple-700"
//               rows={3}
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="px-4 py-2 bg-gray-300 rounded-xl shadow hover:bg-gray-400 transition-all duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEdit}
//                 disabled={loading}
//                 className={`px-4 py-2 bg-blue-300 text-white rounded-xl shadow hover:bg-blue-400 transition-all duration-200 ${
//                   loading ? 'opacity-70 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {loading ? 'Saving...' : 'Save'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
