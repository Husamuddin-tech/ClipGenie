'use client';

import { SessionProvider } from 'next-auth/react';
import { ImageKitProvider } from 'imagekitio-next';
// import { NotificationProvider } from "./Notification";

const urlEndpoint = process.env.IMAGEKIT_URI_ENDPOINT!;
const publicKey = process.env.IMAGEKIT_PUBLIC_KEY!;

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
      {/* <NotificationProvider> */}
      <ImageKitProvider
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        {children}
      </ImageKitProvider>
      {/* </NotificationProvider> */}
    </SessionProvider>
  );
}
