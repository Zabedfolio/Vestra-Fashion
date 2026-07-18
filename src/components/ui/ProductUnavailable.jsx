'use client';

import React from 'react';
import Link from 'next/link';

export default function ProductUnavailable() {
  return (
    <main className="w-full bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-8 sm:p-10 flex flex-col items-center">
          {/* Alert icon */}
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h1 className="font-heading font-black text-xl uppercase tracking-wider text-dark mb-3">
            Product Not Available
          </h1>
          <p className="font-body text-zinc-500 text-sm leading-relaxed mb-8">
            This product is currently not available in our store or might have been moved.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-white font-heading font-bold text-xs tracking-widest uppercase rounded-full hover:bg-[#C9FA75] hover:text-dark transition-all duration-200"
          >
            All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
