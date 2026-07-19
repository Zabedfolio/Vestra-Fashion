'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth-context';
import { apiClient } from '../../lib/apiClient';
import { Person, Envelope, Smartphone, CircleCheck } from '@gravity-ui/icons';

export default function CustomerProfilePage() {
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [updating, setUpdating] = useState(false);

  // Sync state once user info is loaded
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user, authLoading, router]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setUpdating(true);
    const toastId = toast.loading('Saving profile changes...');
    try {
      await apiClient.put('/api/profile', { name, email, phone });
      await refreshUser(); // Update client auth-context state instantly!
      toast.success('Profile updated successfully!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update profile details', { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-heading font-bold text-zinc-400 uppercase text-[10px] tracking-wider animate-pulse">Loading profile settings...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-6 sm:py-16 md:py-20 animate-fade-in font-body">
      <div className="bg-white border border-zinc-150 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <h1 className="font-heading font-black text-2xl text-dark uppercase tracking-tight mb-1.5 flex items-center gap-2">
            <Person className="w-6 h-6 text-dark" /> Profile Settings
          </h1>
          <p className="text-zinc-500 text-xs">Update your personal account identity details below.</p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">
              Full Name
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-dark rounded-xl text-xs outline-none transition-colors duration-200 font-heading font-bold uppercase tracking-wider"
              />
              <Person className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-dark rounded-xl text-xs outline-none transition-colors duration-200 font-mono"
              />
              <Envelope className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Mobile Phone Number */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">
              Mobile Number
            </label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-dark rounded-xl text-xs outline-none transition-colors duration-200 font-mono"
              />
              <Smartphone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={updating}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-dark text-white hover:bg-[#C9FA75] hover:text-dark font-heading font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {updating ? 'Saving Changes...' : 'Save Profile Settings'}
              {!updating && <CircleCheck className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
