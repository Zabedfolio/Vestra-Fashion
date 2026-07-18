'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (name && email && password) {
      toast.success('Account created successfully! Welcome to VESTRA (Demo).');
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
              Join Vestra
            </span>
            <h1 className="font-heading font-black text-3xl text-dark uppercase tracking-tight leading-none mb-3">
              Register <span className="text-[#C9FA75]">Here</span>
            </h1>
            <p className="font-body text-zinc-500 text-sm">
              Create an account for personalized recommendations and speed checkouts.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-sm font-body outline-none transition-colors duration-200"
              />
            </div>

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
              <label htmlFor="password" className="block text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Password
              </label>
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-sm font-body outline-none transition-colors duration-200"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-zinc-300 text-dark focus:ring-dark cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 text-xs font-body text-zinc-500 cursor-pointer select-none leading-normal">
                I agree to the VESTRA Terms of Service and Privacy Policy.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-dark text-white hover:bg-[#C9FA75] hover:text-dark py-3.5 rounded-xl font-heading font-bold tracking-widest text-xs uppercase transition-colors duration-200 active:scale-99 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              Sign Up
            </button>
          </form>

          {/* Footer link to login */}
          <div className="mt-8 pt-6 border-t border-zinc-200/60 text-center">
            <p className="text-xs font-body text-zinc-500">
              Already have an account?{' '}
              <Link href="/login" className="font-heading font-bold text-dark hover:underline uppercase tracking-wider text-[11px] ml-1">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
