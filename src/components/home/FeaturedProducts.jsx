'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { TShirt } from '@gravity-ui/icons';
import ProductCard from '../ui/ProductCard';

const sections = [
  {
    category: 'Men',
    href: '/products?category=Men',
    eyebrow: 'Built for the bold',
    headline: 'Made for Men',
    accent: 'Men',
    description: 'Sharp fits, clean cuts, and everyday essentials — designed for the man who moves with purpose.',
  },
  {
    category: 'Women',
    href: '/products?category=Women',
    eyebrow: 'Effortless & elegant',
    headline: 'Crafted for Women',
    accent: 'Women',
    description: 'From boardroom confidence to weekend ease — pieces that feel as good as they look.',
  },
  {
    category: 'Kids',
    href: '/products?category=Kids',
    eyebrow: 'Little fits, big style',
    headline: 'Styled for Kids',
    accent: 'Kids',
    description: 'Durable, comfortable, and impossibly cool — because great style starts early.',
  },
];

function CategorySection({ section, categoryProducts, isLoading }) {
  const headlineParts = section.headline.split(section.accent);

  return (
    <div className="mb-24 last:mb-0 animate-fade-in">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-[10px] font-heading font-bold tracking-[0.25em] text-zinc-400 uppercase mb-2">
            {section.eyebrow}
          </p>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#111111] uppercase tracking-tight leading-none">
            {headlineParts[0]}
            <span className="text-[#C9FA75]">{section.accent}</span>
            {headlineParts[1]}
          </h2>
          <p className="font-body text-zinc-500 text-sm mt-3 max-w-md leading-relaxed">
            {section.description}
          </p>
        </div>
        {!isLoading && categoryProducts && categoryProducts.length > 0 && (
          <Link
            href={section.href}
            className="hidden sm:inline-flex items-center gap-2 shrink-0 text-sm font-heading font-bold tracking-widest text-[#111111] uppercase hover:text-zinc-500 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col bg-white animate-pulse">
              <div className="bg-zinc-50 rounded-2xl aspect-[3/4] w-full mb-3" />
              <div className="h-3 bg-zinc-100 w-1/3 mb-2 rounded" />
              <div className="h-4 bg-zinc-100 w-3/4 rounded" />
            </div>
          ))
        ) : categoryProducts && categoryProducts.length > 0 ? (
          categoryProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-16 border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center bg-zinc-50/30 text-center px-4">
            <TShirt className="w-8 h-8 text-zinc-300 mb-3 animate-pulse" />
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-dark mb-1">No Products Available</h3>
            <p className="font-body text-zinc-400 text-xs max-w-xs leading-relaxed">New items for this collection will be cataloged soon. Check back shortly!</p>
          </div>
        )}
      </div>

      {/* Mobile View All */}
      {!isLoading && categoryProducts && categoryProducts.length > 0 && (
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href={section.href}
            className="inline-flex items-center gap-2 px-7 py-3 border border-[#111111] text-[#111111] font-heading font-bold text-sm tracking-widest uppercase rounded-full hover:bg-[#111111] hover:text-white transition-colors duration-200"
          >
            View All {section.category}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-zinc-100 mt-24 last:hidden" />
    </div>
  );
}

export default function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => apiClient.get('/api/products?limit=100'),
  });

  const allProducts = data?.products || [];

  return (
    <section className="w-full py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {sections.map((section) => {
          const categoryProducts = allProducts
            .filter((p) => p.category === section.category)
            .slice(0, 4);

          return (
            <CategorySection
              key={section.category}
              section={section}
              categoryProducts={categoryProducts}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </section>
  );
}
