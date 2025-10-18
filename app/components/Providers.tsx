'use client';

import { SessionProvider } from 'next-auth/react';
import { ImageKitProvider } from 'imagekitio-next';
import { NotificationProvider } from './Notification';

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;

// console.log(publicKey)

export default function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const response = await fetch('/api/imagekit-auth');
      if (!response.ok) throw new Error('❌ Failed to authenticate 🔒');
      return response.json();
    } catch (error) {
      console.error('ImageKit 🖼️ authentication 🔒 error:', error);
      throw error;
    }
  };

  return (
    <SessionProvider refetchInterval={5 * 60}>
      <NotificationProvider>
        <ImageKitProvider
          publicKey={publicKey}
          urlEndpoint={urlEndpoint}
          authenticator={authenticator}
        >
          <div
            className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 
                      backdrop-blur-sm p-4 transition-all duration-300"
          >
            {children}
          </div>
        </ImageKitProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}
