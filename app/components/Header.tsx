'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { UserRound } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    <header className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 shadow-[0_4px_15px_rgba(150,150,255,0.15)] sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-purple-700 hover:text-purple-800 transition-colors duration-200"
        >
          ClipGiene
        </Link>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              {/* Welcome Message */}
              <span className="hidden sm:inline text-purple-700 font-medium">
                Welcome, {session.user?.name || session.user?.email || 'User'}!
              </span>

              {/* Dropdown */}
              <div className="relative dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle p-2 rounded-full bg-white/70 shadow-[0_0_10px_rgba(150,150,255,0.2)] hover:shadow-[0_0_15px_rgba(150,150,255,0.3)] transition-all duration-200"
                >
                  <UserRound className="h-6 w-6 text-purple-700" />
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[50] p-3 shadow-[0_4px_20px_rgba(150,150,255,0.2)] bg-white/90 backdrop-blur-sm rounded-2xl w-56"
                >
                  <li>
                    <p className="font-semibold text-sm px-2 text-purple-600">
                      {session.user?.email}
                    </p>
                  </li>
                  <li>
                    <Link
                      href="/upload"
                      className="px-3 py-2 rounded-lg text-purple-700 hover:bg-purple-100 transition-all duration-200"
                    >
                      Upload
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => setShowConfirmLogout(true)}
                      className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="flex gap-2 sm:gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-blue-200 text-blue-800 font-semibold shadow-[0_0_8px_rgba(173,216,230,0.4)] hover:shadow-[0_0_15px_rgba(173,216,230,0.6)] hover:bg-blue-300 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-green-200 text-green-800 font-semibold shadow-[0_0_8px_rgba(144,238,144,0.4)] hover:shadow-[0_0_15px_rgba(144,238,144,0.6)] hover:bg-green-300 transition-all duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Notification */}
      {showConfirmLogout && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] sm:w-80 bg-gradient-to-r from-red-200 via-red-100 to-red-200
                        border border-red-300 text-red-900 rounded-2xl shadow-lg p-4 flex justify-between items-center z-50
                        animate-slide-down fade-in transition-all duration-300"
        >
          <span className="font-medium">Are you sure you want to logout?</span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                setShowConfirmLogout(false);
                await handleSignOut();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 hover:scale-105 transition-transform duration-200"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirmLogout(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl shadow hover:bg-gray-400 hover:scale-105 transition-transform duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
