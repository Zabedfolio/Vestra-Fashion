'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      {/* Big 404 number */}
      <h1 className="font-heading font-black text-[10rem] sm:text-[14rem] lg:text-[18rem] leading-none tracking-tighter text-[#C9FA75] select-none">
        404
      </h1>

      {/* Thin divider */}
      <div className="w-16 h-px bg-zinc-200 mb-8 -mt-2" />

      {/* Heading */}
      <h2 className="font-heading font-bold text-[#111111] text-2xl sm:text-3xl tracking-wide mb-3 uppercase">
        Page Not Found
      </h2>

      {/* Sub-copy */}
      <p className="font-body text-zinc-500 text-sm sm:text-base max-w-md text-center leading-relaxed mb-10">
        Looks like this page stepped off the runway. The item you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111111] text-white font-heading font-bold text-sm tracking-widest uppercase rounded-full hover:bg-[#333333] transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </Link>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 border border-zinc-200 text-zinc-600 font-heading font-bold text-sm tracking-widest uppercase rounded-full hover:border-[#111111] hover:text-[#111111] transition-colors duration-200"
        >
          Shop All Products
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

    </div>
  );
}
