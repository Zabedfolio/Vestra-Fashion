'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { Star, StarFill } from '@gravity-ui/icons';
import { testimonials as staticTestimonials } from '../../data/testimonials';

export default function Testimonials() {
  // Fetch approved product reviews from the database
  const { data: dbReviews = [], isLoading } = useQuery({
    queryKey: ['public-testimonials-reviews'],
    queryFn: () => apiClient.get('/api/reviews?approved=true'),
  });

  // If loading, show placeholder skeletons
  if (isLoading) {
    return (
      <section className="w-full bg-white py-24 border-t border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-pulse">
            <div className="h-4 bg-zinc-200 rounded w-1/4 mx-auto mb-3" />
            <div className="h-10 bg-zinc-200 rounded w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-zinc-200 rounded w-2/3 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-zinc-50 border border-zinc-100 rounded-2xl p-8 h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Use DB reviews if available; fallback to static data if no reviews exist in DB
  const items = dbReviews.length > 0 ? dbReviews : staticTestimonials.map((t, idx) => ({
    _id: `static-${idx}`,
    userName: t.name,
    rating: t.rating,
    reviewText: t.content,
    // Static items do not have real products, so they won't render the product cards
  }));

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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div 
              key={item._id} 
              className="bg-zinc-50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-zinc-100/50 hover:border-zinc-200 transition-all duration-300 group"
            >
              <div>
                {/* Gravity UI Star Rating */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => {
                    const Icon = i < Math.floor(item.rating) ? StarFill : Star;
                    return (
                      <Icon 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(item.rating) 
                            ? 'text-[#C9FA75]' 
                            : 'text-zinc-200'
                        }`} 
                      />
                    );
                  })}
                </div>

                {/* Review Text content */}
                <p className="font-body text-zinc-650 italic text-xs sm:text-sm leading-relaxed mb-6">
                  "{item.reviewText || item.comment || 'Outstanding product design!'}"
                </p>
              </div>

              {/* Bottom profile and product card */}
              <div className="space-y-4 pt-4 border-t border-zinc-150/60">
                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-200 flex-shrink-0 flex items-center justify-center font-heading font-bold text-[10px] text-dark uppercase">
                    {(item.userName || 'VB').substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-dark text-xs uppercase tracking-wide leading-none">
                      {item.userName || 'Verified Buyer'}
                    </h4>
                    <p className="text-[9px] font-mono text-zinc-400 mt-1">Verified Purchase</p>
                  </div>
                </div>

                {/* Enriched Product Reference Card */}
                {item.productName && (
                  <Link
                    href={`/products/${item.productId}`}
                    className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-zinc-150/70 hover:border-dark transition-colors duration-150"
                  >
                    {item.productImage && (
                      <div className="relative w-8 h-10 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                        <Image 
                          src={item.productImage} 
                          alt={item.productName} 
                          fill 
                          className="object-cover" 
                          sizes="32px" 
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] font-heading font-bold uppercase tracking-wider text-zinc-400">Review for</p>
                      <h5 className="font-heading font-bold text-dark text-[10px] truncate uppercase mt-0.5">
                        {item.productName}
                      </h5>
                    </div>
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
