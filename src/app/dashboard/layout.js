'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import Image from 'next/image';

export default function DashboardLayout({ children }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-dark border-t-[#C9FA75] rounded-full animate-spin" />
        <p className="font-heading font-bold text-zinc-400 uppercase tracking-widest text-[10px] mt-4">Verifying admin access...</p>
      </div>
    );
  }

  // Guard: Admin role verification
  if (!user || user.role !== 'admin') {
    return (
      <div className="w-full h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark mb-2">Access Denied</h1>
        <p className="font-body text-zinc-500 text-sm max-w-sm mb-6">
          You do not have the required permissions to access the administrator panel.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-dark text-white hover:bg-[#C9FA75] hover:text-dark px-8 py-3 rounded-xl font-heading font-bold tracking-widest text-[10px] uppercase transition-colors"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const navLinks = [
    { name: 'Overview', href: '/dashboard', icon: '📊' },
    { name: 'Products', href: '/dashboard/products', icon: '👕' },
    { name: 'Orders', href: '/dashboard/orders', icon: '📦' },
    { name: 'Customers', href: '/dashboard/customers', icon: '👥' },
    { name: 'Reviews', href: '/dashboard/reviews', icon: '★' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 font-body text-dark overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-dark text-white w-64 flex flex-col flex-shrink-0 transition-all duration-300 z-30 border-r border-zinc-850 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        } fixed inset-y-0 left-0 lg:static`}
      >
        {/* Brand Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-850">
          <Link href="/" className="flex items-center gap-2">
            <span className={`font-heading font-black tracking-tight text-xl text-white ${!isSidebarOpen && 'lg:hidden'}`}>
              VESTRA <span className="text-[#C9FA75]">HQ</span>
            </span>
            {!isSidebarOpen && <span className="hidden lg:block text-[#C9FA75] font-black text-lg">V</span>}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4.5 px-4.5 py-3.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C9FA75] text-dark shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-850 hover:text-white'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span className={!isSidebarOpen ? 'lg:hidden' : ''}>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-zinc-850 bg-zinc-950/40">
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full flex items-center justify-center gap-3 px-4.5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 hover:text-red-300 hover:bg-red-950/20 text-xs font-heading font-bold uppercase tracking-wider transition cursor-pointer"
          >
            <span>🚪</span>
            <span className={!isSidebarOpen ? 'lg:hidden' : ''}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Header */}
        <header className="h-16 bg-white border-b border-zinc-150 flex items-center justify-between px-6 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-100 rounded-lg text-dark transition cursor-pointer"
            >
              ☰
            </button>
            <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-400">
              Dashboard / {navLinks.find(l => pathname === l.href)?.name || 'Admin'}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-heading font-bold">
            <Link
              href="/"
              className="px-4.5 py-2 border border-zinc-200 hover:border-dark rounded-full text-dark transition duration-200"
            >
              ← View Store
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-dark text-white font-heading font-black text-xs flex items-center justify-center border border-zinc-300 shadow-sm uppercase">
                {user.name.charAt(0)}
              </span>
              <span className="hidden sm:inline text-dark">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Main nested route screen content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-zinc-50/50">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
