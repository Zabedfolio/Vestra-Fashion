'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { ChartBar, TShirt, Box, Person, Star, Gear, House, ArrowRightFromSquare, CircleExclamation, Comment, Envelope, StarFill } from '@gravity-ui/icons';

export default function DashboardLayout({ children }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => apiClient.get('/api/platform-stats'),
    enabled: !!user && user.role === 'admin',
    refetchInterval: 15000,
  });

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
    { name: 'Overview', href: '/dashboard', icon: ChartBar },
    { name: 'Products', href: '/dashboard/products', icon: TShirt },
    { name: 'Orders', href: '/dashboard/orders', icon: Box },
    { name: 'Users', href: '/dashboard/users', icon: Person },
    { name: 'Chats', href: '/dashboard/chats', icon: Comment },
    { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
    { name: 'Reports', href: '/dashboard/reports', icon: CircleExclamation },
    { name: 'Contacts', href: '/dashboard/contacts', icon: Envelope },
    { name: 'Wishlists', href: '/dashboard/wishlists', icon: StarFill },
    { name: 'Settings', href: '/dashboard/settings', icon: Gear },
    { name: 'Return Home', href: '/', icon: House },
  ];

  const getBadgeCount = (name) => {
    if (!stats) return 0;
    if (name === 'Orders') return stats.pendingOrdersCount ?? 0;
    if (name === 'Reviews') return stats.pendingReviewsCount ?? 0;
    if (name === 'Reports') return stats.pendingReportsCount ?? 0;
    return 0;
  };

  return (
    <div className="flex h-screen bg-zinc-50 font-body text-dark overflow-hidden">
      {/* Mobile sidebar backdrop overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300 cursor-pointer"
        />
      )}

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
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto font-heading">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const IconComponent = link.icon;
            const badgeCount = getBadgeCount(link.name);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`flex items-center px-4.5 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C9FA75] text-dark shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-850 hover:text-white'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  {badgeCount > 0 && !isSidebarOpen && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#C9FA75] rounded-full border border-dark animate-pulse" />
                  )}
                </div>
                <span className={`ml-3.5 ${!isSidebarOpen ? 'lg:hidden' : ''}`}>{link.name}</span>
                {badgeCount > 0 && isSidebarOpen && (
                  <span className={`ml-auto font-mono text-[9px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-dark text-white' : 'bg-[#C9FA75] text-dark'}`}>
                    {badgeCount}
                  </span>
                )}
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
            <ArrowRightFromSquare className="w-4 h-4 text-red-400 flex-shrink-0" />
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
              className="px-3.5 sm:px-4.5 py-2 border border-zinc-200 hover:border-dark rounded-full text-dark transition duration-200 flex items-center gap-1.5"
            >
              <House className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Store</span>
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
