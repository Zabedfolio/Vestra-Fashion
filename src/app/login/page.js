'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      toast.success('Signed in successfully! (Demo)');
    } else {
      toast.error('Please fill in all fields.');
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
              <Link href="/register" className="font-heading font-bold text-dark hover:underline uppercase tracking-wider text-[11px] ml-1">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
