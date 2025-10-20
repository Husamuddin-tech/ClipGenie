'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { UserRound } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '../assets/logo.png';

export default function Header() {
  const { data: session } = useSession();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error', error);
    }
  };

  // Auto-dismiss confirmation after 5 seconds
  useEffect(() => {
    if (showConfirmLogout) {
      const timer = setTimeout(() => {
        setShowConfirmLogout(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showConfirmLogout]);

  return (
    <header
      className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 
             shadow-[0_4px_25px_rgba(150,150,255,0.1)] sticky top-0 z-50 
             backdrop-blur-md transition-all duration-500"
    >
      <div
        className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 
               flex justify-between items-center gap-4"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center group transition-all duration-500"
        >
          <div
            className="relative flex items-center justify-center rounded-full p-[3px]
                   bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300
                   shadow-[0_0_18px_rgba(150,150,255,0.25)] 
                   group-hover:shadow-[0_0_28px_rgba(150,150,255,0.35)]
                   transition-all duration-500 transform group-hover:-translate-y-0.5"
          >
            <Image
              src={logo}
              alt="ClipGiene Logo"
              width={72}
              height={72}
              className="rounded-full object-cover w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                     shadow-[0_0_20px_rgba(150,150,255,0.25)] 
                     group-hover:shadow-[0_0_35px_rgba(150,150,255,0.4)]
                     transition-all duration-500"
            />
          </div>
        </Link>

        {/* Auth Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {session ? (
            <>
              {/* Welcome Message */}
              <span
                className="hidden sm:inline text-purple-700 font-medium 
                       truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px] 
                       text-sm sm:text-base"
              >
                Welcome,&nbsp;
                {session.user?.name || session.user?.email || 'User'}!
              </span>

              {/* Dropdown */}
              <div className="relative dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle p-2 sm:p-3 
                         rounded-full bg-white/70 
                         shadow-[0_0_12px_rgba(150,150,255,0.15)] 
                         hover:shadow-[0_0_20px_rgba(150,150,255,0.25)]
                         transition-all duration-300"
                >
                  <UserRound className="h-5 w-5 sm:h-6 sm:w-6 text-purple-700" />
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-50 p-4 sm:p-5
                         shadow-[0_6px_30px_rgba(150,150,255,0.15)] 
                         bg-white/95 backdrop-blur-md rounded-3xl w-56 sm:w-60
                         space-y-2 animate-dropdown-in origin-top transition-all duration-300"
                >
                  <li>
                    <p className="font-semibold text-sm px-2 text-purple-600 truncate">
                      {session.user?.email}
                    </p>
                  </li>
                  <li>
                    <Link
                      href="/upload"
                      className="px-4 py-2 rounded-lg text-purple-700 
                             hover:bg-purple-100 hover:scale-105 
                             transition-all duration-200"
                    >
                      Upload
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => setShowConfirmLogout(true)}
                      className="w-full text-left px-4 py-2 rounded-lg text-red-600 
                             hover:bg-red-100 hover:scale-105 
                             transition-all duration-200"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-200 text-blue-800 font-semibold 
                       text-sm sm:text-base 
                       shadow-[0_0_12px_rgba(173,216,230,0.35)] 
                       hover:shadow-[0_0_18px_rgba(173,216,230,0.55)] 
                       hover:bg-blue-300 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-green-200 text-green-800 font-semibold 
                       text-sm sm:text-base 
                       shadow-[0_0_12px_rgba(144,238,144,0.35)] 
                       hover:shadow-[0_0_18px_rgba(144,238,144,0.55)] 
                       hover:bg-green-300 transition-all duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showConfirmLogout && (
        <div
          className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] sm:w-80 
                 bg-gradient-to-r from-red-200 via-red-100 to-red-200
                 border border-red-300 text-red-900 rounded-3xl shadow-lg 
                 p-5 flex flex-col gap-4 z-50 animate-popup-bounce 
                 scale-in origin-center transition-all duration-300"
        >
          <span className="font-semibold text-center text-red-800 text-sm sm:text-base">
            Are you sure you want to logout?
          </span>
          <div className="flex justify-between gap-3">
            <button
              onClick={async () => {
                setShowConfirmLogout(false);
                await handleSignOut();
              }}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl shadow 
                     hover:bg-red-600 hover:scale-105 transition-transform duration-200"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirmLogout(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-xl shadow 
                     hover:bg-gray-400 hover:scale-105 transition-transform duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
