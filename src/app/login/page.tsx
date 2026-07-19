'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import toast from 'react-hot-toast';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push(redirect || '/');
      }
    } catch (error) {
      // Error is toasted inside auth.js login
    }
  };

  return (
    <main className="w-full bg-white py-20 sm:py-28 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-8 sm:p-10 shadow-sm">
          
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-[10px] font-heading font-bold tracking-[0.25em] text-zinc-400 uppercase block mb-3">
              Account Access
            </span>
            <h1 className="font-heading font-black text-3xl text-dark uppercase tracking-tight leading-none mb-3">
              Welcome <span className="text-[#C9FA75]">Back</span>
            </h1>
            <p className="font-body text-zinc-500 text-sm">
              Enter your credentials to access your VESTRA account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-sm font-body outline-none transition-colors duration-200"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-heading font-bold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
                <a href="#" className="text-xs font-heading font-semibold text-zinc-400 hover:text-dark transition-colors">
                  Forgot?
                </a>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-sm font-body outline-none transition-colors duration-200"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                name="remember-me"
                className="w-4 h-4 rounded border-zinc-300 text-dark focus:ring-dark cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs font-body text-zinc-500 cursor-pointer select-none">
                Remember my device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-dark text-white hover:bg-[#C9FA75] hover:text-dark py-3.5 rounded-xl font-heading font-bold tracking-widest text-xs uppercase transition-colors duration-200 active:scale-99 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              Sign In
            </button>
          </form>

          {/* Footer link to signup */}
          <div className="mt-8 pt-6 border-t border-zinc-200/60 text-center">
            <p className="text-xs font-body text-zinc-500">
              Don't have an account?{' '}
              <Link href={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"} className="font-heading font-bold text-dark hover:underline uppercase tracking-wider text-[11px] ml-1">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="w-full bg-white py-20 min-h-[80vh] flex items-center justify-center">
        <p className="font-heading font-bold text-zinc-300 uppercase tracking-widest text-sm">Loading...</p>
      </main>
    }>
      <LoginContent />
    </Suspense>
  );
}
