"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Magnifier, ShoppingBag, Heart, Bars, Xmark, Person, ChevronDown, ChartBar, Box, ArrowRightFromSquare, CircleExclamation } from '@gravity-ui/icons';
import { useAuth } from '../../lib/auth-context';

export default function Navbar() {
  const pathname = usePathname();
  if (pathname?.startsWith('/dashboard')) return null;
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);

  // Sync cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const saved = localStorage.getItem('vestra_cart');
        const items = saved ? JSON.parse(saved) : [];
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        setTotalItems(count);
      } catch (e) {
        console.error(e);
      }
    };

    updateCartCount();

    // Listen to custom cart-change events
    window.addEventListener('cart-change', updateCartCount);
    // Listen to storage events for cross-tab syncing
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cart-change', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  // Sync wishlist count from localStorage
  useEffect(() => {
    const updateWishlistCount = () => {
      try {
        const stored = localStorage.getItem('vestra_wishlist');
        if (stored) {
          const items = JSON.parse(stored);
          setWishlistCount(items.length);
        } else {
          setWishlistCount(0);
        }
      } catch (e) {
        console.error(e);
      }
    };

    updateWishlistCount();

    // Listen to storage events to keep sync if added in another tab/component
    window.addEventListener('storage', updateWishlistCount);
    // Listen to custom wishlist events dispatched inside product cards
    window.addEventListener('wishlist-updated', updateWishlistCount);
    
    return () => {
      window.removeEventListener('storage', updateWishlistCount);
      window.removeEventListener('wishlist-updated', updateWishlistCount);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Mobile Menu Icon */}
          <button 
            type="button" 
            onClick={() => setIsMenuOpen(true)}
            className="text-dark p-2 hover:bg-zinc-100 rounded-full lg:hidden focus:outline-none"
          >
            <Bars className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex lg:flex-1 justify-start">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo-navbar-trans.png" 
                alt="VESTRA logo"
                width={150}
                height={42}
                className="object-contain h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex lg:gap-x-8 items-center">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors duration-200 py-2 hover:text-primary ${
                pathname === '/' ? 'text-dark border-b-2 border-primary font-bold' : 'text-zinc-600'
              }`}
            >
              Home
            </Link>

            <Link
              href="/products"
              className={`text-sm font-semibold transition-colors duration-200 py-2 hover:text-primary ${
                pathname === '/products' ? 'text-dark border-b-2 border-primary font-bold' : 'text-zinc-600'
              }`}
            >
              Products
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-primary transition py-2 cursor-pointer focus:outline-none">
                Categories
                <svg className="w-3.5 h-3.5 mt-0.5 text-zinc-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-0 w-44 rounded-lg shadow-xl bg-white border border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/products?category=Men" className="block px-4 py-2 text-sm text-dark hover:bg-zinc-50 font-body transition-colors">Men</Link>
                  <Link href="/products?category=Women" className="block px-4 py-2 text-sm text-dark hover:bg-zinc-50 font-body transition-colors">Women</Link>
                  <Link href="/products?category=Kids" className="block px-4 py-2 text-sm text-dark hover:bg-zinc-50 font-body transition-colors">Kids</Link>
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className={`text-sm font-semibold transition-colors duration-200 py-2 hover:text-primary ${
                pathname === '/about' ? 'text-dark border-b-2 border-primary font-bold' : 'text-zinc-600'
              }`}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className={`text-sm font-semibold transition-colors duration-200 py-2 hover:text-primary ${
                pathname === '/contact' ? 'text-dark border-b-2 border-primary font-bold' : 'text-zinc-600'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Icons Action Row */}
          <div className="flex flex-1 items-center justify-end gap-x-4">
            
            {/* Search Toggle */}
            <button 
              type="button" 
              onClick={() => setIsSearchOpen(true)}
              className="text-dark p-2 hover:bg-zinc-100 rounded-full transition"
            >
              <Magnifier className="w-5 h-5" />
            </button>

            {/* Dynamic Auth Section */}
            {user ? (
              <div className="hidden sm:flex items-center relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-500 border border-zinc-200 px-4 py-2.5 rounded-full bg-zinc-50 hover:bg-zinc-100 hover:text-dark transition duration-200 whitespace-nowrap cursor-pointer"
                >
                  <span>{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setIsProfileOpen(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2.5 w-48 bg-white border border-zinc-150 rounded-2xl shadow-xl py-2 z-50 animate-scale-up">
                      <div className="px-4 py-2.5 border-b border-zinc-100 mb-1">
                        <p className="text-[9px] font-heading font-bold text-zinc-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs font-semibold text-dark truncate mt-0.5">{user.name}</p>
                        <p className="text-[10px] text-zinc-400 capitalize mt-0.5">{user.role}</p>
                      </div>

                      {user.role === 'admin' ? (
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-heading font-bold text-red-500 hover:bg-zinc-50 uppercase tracking-wider transition-colors"
                        >
                          <ChartBar className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                          <span>Dashboard</span>
                        </Link>
                      ) : (
                        <>
                          <Link
                            href="/orders"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-heading font-bold text-dark hover:bg-zinc-50 uppercase tracking-wider transition-colors"
                          >
                            <Box className="w-3.5 h-3.5 flex-shrink-0 text-dark" />
                            <span>My Orders</span>
                          </Link>

                          <Link
                            href="/products?wishlist=true"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-heading font-bold text-dark hover:bg-zinc-50 uppercase tracking-wider transition-colors"
                          >
                            <Heart className="w-3.5 h-3.5 flex-shrink-0 text-dark" />
                            <span>Wishlist</span>
                          </Link>

                          <Link
                            href="/reports"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-heading font-bold text-dark hover:bg-zinc-50 uppercase tracking-wider transition-colors"
                          >
                            <CircleExclamation className="w-3.5 h-3.5 flex-shrink-0 text-dark" />
                            <span>Dispute Reports</span>
                          </Link>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                          router.push('/');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-heading font-bold text-zinc-650 hover:text-dark hover:bg-zinc-50 uppercase tracking-wider transition-colors cursor-pointer border-t border-zinc-100 mt-1"
                      >
                        <ArrowRightFromSquare className="w-3.5 h-3.5 flex-shrink-0 text-zinc-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hidden sm:inline-flex items-center gap-1.5 px-4.5 py-2 border border-zinc-200 hover:border-dark text-dark text-xs font-heading font-bold uppercase tracking-wider rounded-full transition duration-200"
              >
                <Person className="w-4 h-4 text-dark" />
                Login
              </Link>
            )}

            {/* Wishlist Link */}
            {(!user || user.role !== 'admin') && (
              <Link href="/products?wishlist=true" className="relative text-dark p-2 hover:bg-zinc-100 rounded-full transition">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-dark rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Shopping Cart Button */}
            {(!user || user.role !== 'admin') && (
              <button
                onClick={() => window.dispatchEvent(new Event('open-cart'))}
                className="relative text-dark p-2 hover:bg-zinc-100 rounded-full transition cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-dark bg-primary rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- Overlay Search Drawer --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-dark/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSearchOpen(false)}
          />
          {/* Search Content */}
          <div className="absolute top-0 left-0 right-0 bg-white shadow-md p-6 transition-all duration-300">
            <div className="mx-auto max-w-3xl flex items-center justify-between">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
                <Magnifier className="text-zinc-400 w-5 h-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-base font-body border-0 outline-none focus:ring-0 text-dark placeholder-zinc-400"
                  autoFocus
                />
              </form>
              <button 
                type="button" 
                onClick={() => setIsSearchOpen(false)}
                className="text-dark p-2 hover:bg-zinc-100 rounded-full transition focus:outline-none"
              >
                <Xmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Mobile Sidebar Menu --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-dark/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Drawer Menu */}
          <div className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl animate-slide-in">
            <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-100">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
                <Image 
                  src="/images/logo-navbar-trans.png" 
                  alt="VESTRA logo"
                  width={120}
                  height={34}
                  className="object-contain h-8 w-auto"
                />
              </Link>
              <button 
                type="button" 
                onClick={() => setIsMenuOpen(false)}
                className="text-dark p-2 hover:bg-zinc-100 rounded-full focus:outline-none"
              >
                <Xmark className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="space-y-4 px-4 py-6 border-b border-zinc-100">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block text-base font-semibold py-1 transition-colors ${
                  pathname === '/' ? 'text-primary' : 'text-dark hover:text-primary'
                }`}
              >
                Home
              </Link>
              
              <Link
                href="/products"
                onClick={() => setIsMenuOpen(false)}
                className={`block text-base font-semibold py-1 transition-colors ${
                  pathname === '/products' ? 'text-primary' : 'text-dark hover:text-primary'
                }`}
              >
                Products
              </Link>

              {/* Mobile Categories Group */}
              <div className="py-1">
                <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-heading">Categories</span>
                <div className="pl-3 space-y-2 border-l border-zinc-150">
                  <Link
                    href="/products?category=Men"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm font-semibold text-zinc-600 hover:text-primary transition-colors"
                  >
                    Men
                  </Link>
                  <Link
                    href="/products?category=Women"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm font-semibold text-zinc-600 hover:text-primary transition-colors"
                  >
                    Women
                  </Link>
                  <Link
                    href="/products?category=Kids"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm font-semibold text-zinc-600 hover:text-primary transition-colors"
                  >
                    Kids
                  </Link>
                </div>
              </div>

              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`block text-base font-semibold py-1 transition-colors ${
                  pathname === '/about' ? 'text-primary' : 'text-dark hover:text-primary'
                }`}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`block text-base font-semibold py-1 transition-colors ${
                  pathname === '/contact' ? 'text-primary' : 'text-dark hover:text-primary'
                }`}
              >
                Contact Us
              </Link>

              {user ? (
                <div className="pt-4 border-t border-zinc-150 space-y-3">
                  <div className="px-1 text-xs">
                    <p className="font-heading font-bold text-zinc-400 uppercase tracking-wider">Logged in as</p>
                    <p className="font-bold text-dark truncate">{user.name} ({user.role})</p>
                  </div>
                  {user.role === 'admin' ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center text-xs font-bold uppercase tracking-wider py-3 border border-red-200 text-red-500 hover:border-red-400 rounded-xl transition duration-200"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center text-xs font-bold uppercase tracking-wider py-3 border border-zinc-200 text-zinc-600 hover:border-dark rounded-xl transition duration-200"
                    >
                      My Orders
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                      router.push('/');
                    }}
                    className="w-full block text-center text-xs font-bold uppercase tracking-wider py-3 bg-dark text-white hover:bg-[#C9FA75] hover:text-dark rounded-xl transition duration-200 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-base font-bold py-2 mt-4 text-center border border-zinc-200 hover:border-dark text-dark rounded-xl transition-all duration-200 ${
                    pathname === '/login' ? 'bg-dark text-white border-dark' : ''
                  }`}
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Footer details in menu */}
            <div className="px-4 py-6 text-xs text-zinc-500 font-body">
              <p className="mb-2 font-semibold text-dark">Welcome to VESTRA</p>
              <p>Sign in to unlock personalized deals and fast checkout.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
