import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Video, { IVideo } from '@/models/Video';
import User, { IUser } from '@/models/User';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

// ✅ Disable caching so fresh videos are always fetched
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ---------------- GET VIDEOS ----------------
export async function GET() {
  try {
    await connectToDatabase();

    // Populate owner info (_id, email, name)
    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .populate<{ owner: IUser }>('owner', '_id email')
      .lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error('❌ Failed to fetch videos 🎥', error);
    return NextResponse.json(
      { error: '❌ Failed to fetch videos 🎥' },
      { status: 500 }
    );
  }
}

// ---------------- CREATE VIDEO ----------------
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '🚫 Unauthorized 🔒' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body: IVideo = await request.json();

    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: '⚠️ Missing required fields 📝' },
        { status: 400 }
      );
    }

    const owner = await User.findById(session.user.id);
    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    const videoData = {
      title: body.title,
      description: body.description,
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
      owner: owner._id,
      tags: body.tags ?? [],
    };

    const newVideo = await Video.create(videoData);

    // ✅ Populate owner for the response
    const populatedVideo = await Video.findById(newVideo._id)
      .populate('owner', '_id email')
      .lean();

    return NextResponse.json(populatedVideo, { status: 201 });
  } catch (error) {
    console.error('❌ Failed to create video 🎥', error);
    return NextResponse.json(
      { error: '❌ Failed to create video 🎥' },
      { status: 500 }
    );
  }
}

