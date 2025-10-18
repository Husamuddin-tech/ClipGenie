"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { UserRound } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      {/* Left: Logo */}
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl font-bold">
          ClipGiene
        </Link>
      </div>

      {/* Right: Auth actions */}
      <div className="flex-none">
        {!session ? (
          <Link
            href="/register"
            className="btn btn-outline btn-primary normal-case"
          >
            Register
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <UserRound className="h-6 w-6" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <p className="font-semibold text-sm px-2 text-gray-500">
                  {session.user?.email}
                </p>
              </li>
              <li>
                <Link href="/upload">Upload</Link>
              </li>
              <li>
                <button onClick={() => signOut()}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
