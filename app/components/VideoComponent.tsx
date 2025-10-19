'use client';

import { IKVideo } from 'imagekitio-next';
import Link from 'next/link';
import { IVideo } from '@/models/Video';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useNotification } from './Notification';
import { useSession } from 'next-auth/react';

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

  // 🧠 Only show action buttons if user is logged in AND is owner
  const isOwner =
    !!session?.user?.id && video.owner?._id?.toString() === session.user.id;

  // Show confirmation notification
  const handleDeleteClick = () => setShowConfirmDelete(true);

  // Actual delete call
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

  // PATCH video
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
      className="rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50
                 shadow-[0_0_15px_rgba(150,150,255,0.15)] hover:shadow-[0_0_25px_rgba(150,150,255,0.25)]
                 transition-all duration-300 overflow-hidden relative"
    >
      {/* Confirmation Notification */}
      {showConfirmDelete && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] sm:w-96 bg-gradient-to-r from-pink-200 via-pink-100 to-pink-200 
                  border border-pink-300 text-pink-900 rounded-2xl shadow-lg p-4 flex justify-between items-center z-50
                  animate-slide-down fade-in transition-all duration-300"
        >
          <span className="font-medium">
            Are you sure you want to delete this video?
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteConfirmed}
              className="px-4 py-2 bg-red-400 text-white rounded-xl shadow hover:bg-red-500 hover:scale-105 transition-transform duration-200"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl shadow hover:bg-gray-400 hover:scale-105 transition-transform duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Video Thumbnail */}
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full shadow-[0_0_10px_rgba(0,0,0,0.05)]"
            style={{ aspectRatio: '9/16' }}
          >
            <IKVideo
              path={video.videoUrl}
              transformation={[{ height: '1920', width: '1080' }]}
              controls={video.controls}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </Link>
      </figure>

      {/* Video Info */}
      <div className="p-4 flex flex-col gap-2">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-90 transition-opacity"
        >
          <h2 className="text-lg font-semibold text-purple-700">
            {video.title}
          </h2>
        </Link>
        <p className="text-sm text-purple-600/70 line-clamp-2">
          {video.description}
        </p>

        {/* Action Buttons (Visible only to owner) */}
        {isOwner && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-blue-300 text-white rounded-xl shadow hover:bg-blue-400 transition-all duration-200"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="px-3 py-1 bg-red-300 text-white rounded-xl shadow hover:bg-red-400 transition-all duration-200"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-6 w-11/12 max-w-md shadow-[0_0_25px_rgba(150,150,255,0.25)] relative transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-purple-700">
              Edit Video
            </h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full mb-3 p-2 rounded-xl border-2 border-transparent bg-white/70 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200 text-purple-700"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-2 rounded-xl border-2 border-transparent bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200 mb-4 text-purple-700"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded-xl shadow hover:bg-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={loading}
                className={`px-4 py-2 bg-blue-300 text-white rounded-xl shadow hover:bg-blue-400 transition-all duration-200 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save'}
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

// export default function VideoComponent({ video }: { video: IVideo }) {
//   const router = useRouter();

//   // State for edit modal
//   const [isEditing, setIsEditing] = useState(false);
//   const [title, setTitle] = useState(video.title);
//   const [description, setDescription] = useState(video.description);
//   const [loading, setLoading] = useState(false);

//   // DELETE video
//   const handleDelete = async () => {
//     if (!confirm('Are you sure you want to delete this video?')) return;

//     try {
//       const res = await fetch(`/api/videos/${video._id}`, { method: 'DELETE', credentials: 'include', });
//       if (!res.ok) throw new Error('Failed to delete');
//       alert('Video deleted!');
//       router.refresh(); // Refresh the video list
//     } catch (err) {
//       console.error(err);
//       alert('Error deleting video');
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
//       alert('Video updated!');
//       setIsEditing(false);
//       router.refresh();
//     } catch (err) {
//       console.error(err);
//       alert('Error updating video');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50
//                 shadow-[0_0_15px_rgba(150,150,255,0.15)] hover:shadow-[0_0_25px_rgba(150,150,255,0.25)]
//                 transition-all duration-300 overflow-hidden"
//     >
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

//         {/* Action Buttons */}
//         <div className="mt-3 flex gap-2">
//           <button
//             onClick={() => setIsEditing(true)}
//             className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//           >
//             Edit
//           </button>
//           <button
//             onClick={handleDelete}
//             className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
//           >
//             Delete
//           </button>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {isEditing && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg relative">
//             <h3 className="text-lg font-semibold mb-4">Edit Video</h3>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Title"
//               className="w-full mb-3 p-2 border rounded"
//             />
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Description"
//               className="w-full p-2 border rounded mb-4"
//               rows={3}
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEdit}
//                 disabled={loading}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
