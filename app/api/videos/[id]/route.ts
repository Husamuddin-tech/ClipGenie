import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Video from '@/models/Video';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import imagekit from '@/lib/imagekit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 🧹 Utility: Auth & Owner Check
async function authorizeAndFindVideo(videoId: string, userId?: string) {
  if (!videoId) throw new Error('Missing video ID');
  await connectToDatabase();

  const video = await Video.findById(videoId);
  if (!video) throw new Error('Video not found');

  if (!userId) throw new Error('Unauthorized');

  if (video.owner?.toString() !== userId) {
    throw new Error('Forbidden');
  }

  return video;
}

// ---------------- DELETE VIDEO ----------------
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const video = await authorizeAndFindVideo(context.params.id, session.user.id);

    // Delete files from ImageKit (if exist)
    const deletions = [];
    if (video.videoFileId)
      deletions.push(imagekit.deleteFile(video.videoFileId));
    if (video.thumbnailFileId)
      deletions.push(imagekit.deleteFile(video.thumbnailFileId));
    await Promise.allSettled(deletions);

    await video.deleteOne();

    return NextResponse.json({ message: '✅ Video deleted successfully' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('DELETE error:', err);
      if (err.message === 'Missing video ID')
        return NextResponse.json({ error: err.message }, { status: 400 });
      if (err.message === 'Video not found')
        return NextResponse.json({ error: err.message }, { status: 404 });
      if (err.message === 'Unauthorized')
        return NextResponse.json({ error: err.message }, { status: 401 });
      if (err.message === 'Forbidden')
        return NextResponse.json(
          { error: 'You do not have permission to delete this video.' },
          { status: 403 }
        );
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ---------------- PATCH VIDEO ----------------
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const video = await authorizeAndFindVideo(context.params.id, session.user.id);

    // ✅ Only allow safe updates
    if (body.title !== undefined) video.title = body.title;
    if (body.description !== undefined) video.description = body.description;

    await video.save();

    return NextResponse.json({
      message: '✅ Video updated successfully',
      video,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('PATCH error:', err);
      if (err.message === 'Missing video ID')
        return NextResponse.json({ error: err.message }, { status: 400 });
      if (err.message === 'Video not found')
        return NextResponse.json({ error: err.message }, { status: 404 });
      if (err.message === 'Unauthorized')
        return NextResponse.json({ error: err.message }, { status: 401 });
      if (err.message === 'Forbidden')
        return NextResponse.json(
          { error: 'You do not have permission to edit this video.' },
          { status: 403 }
        );
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// old one

// import { authOptions } from '@/lib/auth';
// import { connectToDatabase } from '@/lib/db';
// import Video from '@/models/Video';
// import { getServerSession } from 'next-auth';
// import { NextRequest, NextResponse } from 'next/server';
// import imagekit from '@/lib/imagekit';

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// // ---------------- DELETE VIDEO ----------------
// export async function DELETE(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const { params } = context;
//     const videoId = params.id;
//     if (!videoId)
//       return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

//     const session = await getServerSession(authOptions);
//     if (!session)
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     await connectToDatabase();

//     const video = await Video.findById(videoId);
//     if (!video)
//       return NextResponse.json({ error: 'Video not found' }, { status: 404 });

//     // ---------------- OWNER CHECK ----------------
//     if (video.owner && video.owner.toString() !== session.user?.id) {
//       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//     }

//     // Delete video & thumbnail from ImageKit if present
//     if (video.videoFileId) await imagekit.deleteFile(video.videoFileId);
//     if (video.thumbnailFileId) await imagekit.deleteFile(video.thumbnailFileId);

//     await Video.findByIdAndDelete(videoId);

//     return NextResponse.json({ message: 'Video deleted successfully' });
//   } catch (err) {
//     console.error('DELETE error:', err);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

// // ---------------- PATCH VIDEO ----------------
// export async function PATCH(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const { params } = context;
//     const videoId = params.id;
//     if (!videoId)
//       return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

//     const session = await getServerSession(authOptions);
//     if (!session)
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     await connectToDatabase();

//     const body = await req.json();
//     const video = await Video.findById(videoId);
//     if (!video)
//       return NextResponse.json({ error: 'Video not found' }, { status: 404 });

//     // ---------------- OWNER CHECK ----------------
//     if (video.owner && video.owner.toString() !== session.user?.id) {
//       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//     }

//     // Update fields safely
//     video.title = body.title ?? video.title;
//     video.description = body.description ?? video.description;

//     await video.save();

//     return NextResponse.json(video);
//   } catch (err) {
//     console.error('PATCH error:', err);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }
