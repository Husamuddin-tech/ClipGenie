'use client';

import { SessionProvider } from 'next-auth/react';
import { ImageKitProvider } from '@imagekit/next';
import { NotificationProvider } from './Notification';

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
// const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!; old

// checking
// console.log('✅ ImageKit endpoint:', process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT);

// console.log(publicKey)

export default function Providers({ children }: { children: React.ReactNode }) {
  // old
  // const authenticator = async () => {
  //   try {
  //     const response = await fetch('/api/imagekit-auth');
  //     if (!response.ok) throw new Error('❌ Failed to authenticate 🔒');
  //     return response.json();
  //   } catch (error) {
  //     console.error('ImageKit 🖼️ authentication 🔒 error:', error);
  //     throw error;
  //   }
  // };

  return (
    <SessionProvider refetchInterval={5 * 60}>
      <NotificationProvider>
        <ImageKitProvider
          urlEndpoint={urlEndpoint}
          // publicKey={publicKey}
          // authenticator={authenticator}
        >
          <div
            className="
          min-h-screen 
          bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50
          backdrop-blur-md
          p-4 sm:p-6 md:p-10
          transition-all duration-500
          flex flex-col
          items-center
          justify-start
        "
          >
            <div className="w-full max-w-[1400px] rounded-3xl bg-white/50 backdrop-blur-lg shadow-[0_8px_30px_rgba(150,150,255,0.1)] transition-all duration-500 p-6 sm:p-8 md:p-10">
              {children}
            </div>
          </div>
        </ImageKitProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}
