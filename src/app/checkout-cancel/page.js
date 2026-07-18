'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';

function CancelContent() {
  return (
    <main className="w-full bg-white py-24 sm:py-32 min-h-[85vh] flex items-center justify-center animate-fade-in">
      <div className="max-w-md w-full px-6 text-center space-y-6">
        <div className="w-16 h-16 bg-zinc-50 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-150">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <span className="text-[10px] font-heading font-bold tracking-[0.25em] text-zinc-400 uppercase">
          Payment Cancelled
        </span>

        <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark uppercase tracking-tight leading-none mt-4">
          Checkout <br />Was <span className="text-zinc-400">Cancelled</span>
        </h1>

        <p className="font-body text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
          No charge has been made. If you experienced any issues during payment, please try again or contact support.
        </p>

        <div className="pt-8 space-y-3">
          <button
            onClick={() => window.dispatchEvent(new Event('open-cart'))}
            className="w-full block bg-dark text-white hover:bg-[#C9FA75] hover:text-dark py-4 rounded-xl font-heading font-bold tracking-widest text-xs uppercase transition-colors duration-200 cursor-pointer"
          >
            Review Your Bag
          </button>
          <Link
            href="/products"
            className="w-full block border border-zinc-200 hover:border-dark text-dark py-4 rounded-xl font-heading font-bold tracking-widest text-xs uppercase transition-colors duration-200"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <main className="w-full bg-white py-24 min-h-[85vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-dark border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <CancelContent />
    </Suspense>
  );
}
