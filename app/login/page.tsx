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
      className="max-w-md mx-auto rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50
             shadow-[0_0_25px_rgba(150,150,255,0.15)] p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_0_35px_rgba(150,150,255,0.25)]"
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-700 mb-6 text-center">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-medium text-purple-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-3 rounded-2xl border-2 border-transparent bg-white/70
                   focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent
                   transition-all duration-300 text-pink-500 placeholder:text-pink-300
                   hover:bg-white/90 hover:shadow-[0_0_8px_rgba(255,182,193,0.3)]"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="mb-2 font-medium text-purple-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-5 py-3 rounded-2xl border-2 border-transparent bg-white/70
                   focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent
                   transition-all duration-300 text-pink-500 placeholder:text-pink-300
                   hover:bg-white/90 hover:shadow-[0_0_8px_rgba(255,182,193,0.3)]"
            placeholder="********"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-3 rounded-2xl bg-pink-400 text-white font-semibold
                 shadow-[0_0_12px_rgba(255,182,193,0.4)] hover:shadow-[0_0_24px_rgba(255,182,193,0.6)]
                 hover:bg-pink-500 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="text-center mt-4 text-purple-700 text-sm sm:text-base">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-pink-500 hover:text-pink-600 font-medium transition-colors duration-200"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
