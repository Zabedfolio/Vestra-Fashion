import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, ArrowRotateLeft, Shield, ArrowRight } from '@gravity-ui/icons';

export default function Hero() {
  return (
    <section className="flex flex-col w-full">
      {/* Main Dark Hero Banner */}
      <div className="relative bg-dark text-white overflow-hidden py-24 sm:py-32 lg:py-40 flex items-center min-h-[480px] sm:min-h-[560px]">
        {/* Background Image with Left Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero/hero-v2.png" 
            alt="VESTRA Fashion Collection" 
            fill
            priority
            sizes="100vw"
            className="object-cover object-[80%_center] opacity-100 scale-105 transition-transform duration-500"
          />
          {/* Left-fading dark gradient mask to protect text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/35 to-transparent z-10" />
        </div>

        {/* Content Container */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20 w-full">
          <div className="max-w-2xl text-left">
            <span className="text-primary font-heading font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] block mb-4">
              New Collection '26
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase leading-[1.1] mb-6">
              Defining <br/>
              <span className="text-primary">Modern Style</span>
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base md:text-lg font-body max-w-lg mb-10 leading-relaxed">
              Explore our premium minimalist wardrobe collection. Clean cuts, high-end details, and bold silhouettes made to feel like yourself, only sharper.
            </p>
            <div>
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2.5 justify-center font-bold tracking-wider uppercase text-xs md:text-sm bg-primary text-dark hover:bg-white hover:text-dark shadow-md rounded-full py-4 px-8 transition-all duration-200 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 text-dark group-hover:text-dark" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Row */}
      <div className="bg-gray-light py-6 border-b border-zinc-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            
            {/* Free Shipping Badge */}
            <div className="flex items-center justify-center gap-3">
              <Box className="w-5 h-5 text-dark flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-dark font-heading uppercase tracking-wider">
                Free Shipping Worldwide
              </span>
            </div>

            {/* Returns Badge */}
            <div className="flex items-center justify-center gap-3 border-y sm:border-y-0 sm:border-x border-zinc-200/80 py-3 sm:py-0">
              <ArrowRotateLeft className="w-5 h-5 text-dark flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-dark font-heading uppercase tracking-wider">
                Easy 30-Day Returns
              </span>
            </div>

            {/* Secure Checkout Badge */}
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-5 h-5 text-dark flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-dark font-heading uppercase tracking-wider">
                100% Secure Checkout
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
