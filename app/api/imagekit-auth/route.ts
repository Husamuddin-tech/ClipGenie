import { getUploadAuthParams } from '@imagekit/next/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      return NextResponse.json(
        { error: 'Missing ImageKit environment variables' },
        { status: 400 }
      );
    }

    const { signature, expire, token } = getUploadAuthParams({
      privateKey,
      publicKey,
    });

    return NextResponse.json({ signature, expire, token });
  } catch (error) {
    console.error('🖼️ ImageKit authentication failed ❌', error);
    return NextResponse.json(
      { error: 'ImageKit authentication failed ❌' },
      { status: 500 }
    );
  }
}
