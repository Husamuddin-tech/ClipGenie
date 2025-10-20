import { getUploadAuthParams } from '@imagekit/next/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { signature, expire, token } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    });

    // ✅ Return only the keys ImageKit expects
    return NextResponse.json({ signature, expire, token });
  } catch (error) {
    console.error('🖼️ ImageKit authentication failed ❌', error);
    return NextResponse.json(
      { error: 'ImageKit authentication failed ❌' },
      { status: 500 }
    );
  }
}

// Old version of ImageKit

// import imagekit from '@/lib/imagekit';
// import { NextResponse } from 'next/server';

// // The below code is transfer to lib/imagekit.ts
// // import ImageKit from 'imagekit';
// // const imagekit = new ImageKit({
// //   publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
// //   privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
// //   urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
// // });

// export async function GET() {
//   try {
//     const authenticationParameters = imagekit.getAuthenticationParameters();
//     return NextResponse.json(authenticationParameters);
//   } catch (error) {
//     console.error('🖼️ Imagekit Auth Failed ❌', error);
//     return NextResponse.json(
//       { error: '🖼️ Imagekit Auth Failed ❌' },
//       { status: 500 }
//     );
//   }
// }
