'use client';

import React from 'react';
import Image from 'next/image';
import { testimonials } from '../../data/testimonials';

export default function Testimonials() {
  return (
    <section className="w-full bg-white py-24 border-t border-zinc-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-heading font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
            Voices of Vestra
          </p>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-dark uppercase tracking-tight leading-none">
            Loved by Our <span className="text-[#C9FA75]">Community</span>
          </h2>
          <p className="font-body text-zinc-500 text-sm sm:text-base mt-4 leading-relaxed">
            Don't just take our word for it. Here is what VESTRA shoppers have to say about their wardrobe upgrades.
          </p>
        </div>

        {/* Testimonials Grid / Mobile Scroll */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto sm:overflow-x-visible pb-6 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="flex-shrink-0 w-[85%] sm:w-full bg-zinc-50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between snap-start border border-zinc-100/50 hover:border-zinc-200 transition-all duration-300 group"
            >
              <div>
                {/* SVG Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-[#C9FA75] fill-[#C9FA75]' : 'text-zinc-200 fill-zinc-200'}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="font-body text-zinc-600 italic text-sm sm:text-base leading-relaxed mb-8">
                  "{item.content}"
                </p>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-zinc-200/40">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-200 flex-shrink-0">
                  <Image 
                    src={item.avatar} 
                    alt={item.name} 
                    fill 
                    sizes="44px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    // If avatar is missing, let it fall back gracefully
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Initials Fallback */}
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-300 text-dark font-heading font-bold text-xs uppercase z-[-1]">
                    {item.name.substring(0, 2)}
                  </div>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-dark text-sm sm:text-base leading-none">
                    {item.name}
                  </h4>
                  <p className="font-body text-zinc-400 text-xs mt-1">
                    {item.role}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
