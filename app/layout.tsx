import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './components/Providers';
// import { NotificationProvider } from './components/Notification';
import Header from './components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ClipGiene | Upload, Manage & Explore Stunning Clips',
  description:
    'ClipGiene is your all-in-one platform to upload, edit, and explore creative video clips effortlessly — built with Next.js for speed, beauty, and precision.',
  openGraph: {
    title: 'ClipGiene',
    description:
      'Create, edit, and explore creative video clips with elegance — powered by Next.js.',
    images: [
      {
        url: './assets/logo.png',
        width: 1200,
        height: 630,
        alt: 'ClipGiene Preview Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClipGiene | Upload & Explore Stunning Clips',
    description: 'Experience a beautifully fast video management platform.',
    images: ['./assets/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased 
        min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 
        text-gray-800 selection:bg-purple-200 selection:text-purple-900
        transition-all duration-500 ease-in-out`}
      >
        <Providers>
          {/* <NotificationProvider> */}
            {/* Global Header */}
            <Header />

            {/* Main Content Wrapper */}
            <main
              className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-12 
                         relative overflow-hidden transition-all duration-500"
            >
              {/* Decorative Gradient Overlay */}
              <div
                className="absolute inset-0 -z-10 opacity-50 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.3),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(173,216,230,0.3),transparent_60%)]"
              ></div>

              {/* Content Card */}
              <div
                className="rounded-3xl bg-white/80 backdrop-blur-md 
                           shadow-[0_8px_30px_rgba(150,150,255,0.15)] 
                           p-6 sm:p-8 md:p-10 
                           border border-white/40 hover:shadow-[0_12px_40px_rgba(150,150,255,0.25)] 
                           transition-all duration-500"
              >
                {children}
              </div>
            </main>
          {/* </NotificationProvider> */}
        </Providers>
      </body>
    </html>
  );
}
