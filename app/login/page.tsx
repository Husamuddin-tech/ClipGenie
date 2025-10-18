'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '../components/Notification';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      showNotification(result.error, 'error');
    } else {
      showNotification('Login successful!', 'success');
      router.push('/');
    }
  };

  return (
    <div
      className="max-w-md mx-auto rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50
                shadow-[0_0_20px_rgba(150,150,255,0.15)] p-8 transition-all duration-300"
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-700 mb-6 text-center">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-medium text-purple-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border-2 border-transparent bg-white/70 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="mb-1 font-medium text-purple-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border-2 border-transparent bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-xl bg-pink-400 text-white font-semibold shadow-[0_0_10px_rgba(255,182,193,0.4)] hover:shadow-[0_0_20px_rgba(255,182,193,0.6)] hover:bg-pink-500 transition-all duration-200"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="text-center mt-4 text-purple-700">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
