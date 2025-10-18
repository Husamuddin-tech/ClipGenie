'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

function Header() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('error', error);
    }
  };
  return (
    <div>
        <button onClick={handleSignOut}>SignOut</button>
        {session ? (
            <div>Welcome</div>
        ):(
            <div>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
            </div>
        )}
    </div>
  )
}

export default Header;
