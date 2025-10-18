import ImageKit from 'imagekit';
import { NextResponse } from 'next/server';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URI_ENDPOINT!,
});

export async function GET() {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error('🖼️ Imagekit Auth Failed ❌', error);
    return NextResponse.json(
      { error: '🖼️ Imagekit Auth Failed ❌' },
      { status: 500 }
    );
  }
}
