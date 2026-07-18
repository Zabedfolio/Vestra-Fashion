'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import ProductCard from '../../components/ui/ProductCard';

// Inner component — safe to use useSearchParams() here
function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const maxPriceLimit = 5000;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPriceFilter, setMaxPriceFilter] = useState(maxPriceLimit);
  const [sortBy, setSortBy] = useState('');
  
  const productsPerPage = 12;
  const categories = ['All', 'Men', 'Women', 'Kids'];

  // Fetch products from backend via TanStack Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', selectedCategory, searchQuery, maxPriceFilter, sortBy, currentPage],
    queryFn: () => apiClient.get(`/api/products`, {
      params: {
        category: selectedCategory,
        search: searchQuery,
        maxPrice: maxPriceFilter,
        sort: sortBy,
        page: currentPage,
        limit: productsPerPage,
      }
    }),
    // Custom query parsing since apiClient doesn't take params directly (we can construct query string manually or update query)
    // Wait, let's look at apiClient.js. It does: `apiClient.get(path, options)`. 
    // It appends `path` to base url. So we must pass the query string manually: `/api/products?category=...`
    // Let's write the query Fn to manually construct the string:
    queryFn: () => {
      const q = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') q.set('category', selectedCategory);
      if (searchQuery) q.set('search', searchQuery);
      if (maxPriceFilter) q.set('maxPrice', maxPriceFilter.toString());
      if (sortBy) q.set('sort', sortBy);
      q.set('page', currentPage.toString());
      q.set('limit', productsPerPage.toString());
      return apiClient.get(`/api/products?${q.toString()}`);
    }
  });

  const productsList = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const startIndex = (currentPage - 1) * productsPerPage;

  return (
    <main className="w-full bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-zinc-100 pb-8">
          <p className="text-[10px] font-heading font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
            Explore Vestra
          </p>
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-dark uppercase tracking-tight leading-none mb-4">
            {searchQuery ? (
              <>Search <span className="text-[#C9FA75]">Results</span></>
            ) : (
              <>Shop <span className="text-[#C9FA75]">All</span></>
            )}
          </h1>
          <p className="font-body text-zinc-500 text-sm sm:text-base max-w-xl leading-relaxed">
            {searchQuery 
              ? `Showing results for "${searchQuery}" across our collection of premium essentials.`
              : 'Discover our entire collection of premium essentials. Crafted for clean lines, modern styling, and long-lasting durability.'
            }
          </p>
        </div>

        {/* Filters and Price Range Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-zinc-100">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1); // Go back to page 1
                  }}
                  className={`px-5 py-2.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                    isActive
                      ? 'bg-dark border-dark text-white'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-dark hover:text-dark'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown & Price Range Slider */}
          <div className="flex flex-wrap items-center gap-4 max-w-md w-full">
            {/* Sort Select */}
            <div className="flex-1 min-w-[120px]">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-xs font-heading font-bold uppercase tracking-wider rounded-xl outline-none cursor-pointer text-zinc-600 focus:border-dark"
              >
                <option value="">Sort By</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="ratingDesc">Popularity (Rating)</option>
              </select>
            </div>

            {/* Price range */}
            <div className="flex-1 flex items-center gap-4 bg-zinc-50 border border-zinc-150 px-6 py-3 rounded-xl min-w-[200px]">
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-heading font-bold text-zinc-400 uppercase tracking-wider">Max Price</span>
                  <span className="text-[11px] font-heading font-bold text-dark">৳{maxPriceFilter.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPriceLimit}
                  value={maxPriceFilter}
                  onChange={(e) => {
                    setMaxPriceFilter(Number(e.target.value));
                    setCurrentPage(1); // Go back to page 1
                  }}
                  className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-dark"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Showing Items Count Banner */}
        <div className="flex items-center justify-between mb-8 text-xs sm:text-sm font-heading font-semibold text-zinc-400 uppercase tracking-wider">
          <span>
            {isLoading ? (
              'Loading products...'
            ) : totalProducts > 0 ? (
              `Showing ${startIndex + 1}–${Math.min(startIndex + productsPerPage, totalProducts)} of ${totalProducts} Products`
            ) : (
              '0 Products found'
            )}
          </span>
          {searchQuery && (
            <Link 
              href="/products" 
              className="text-xs text-red-500 hover:text-red-600 font-heading font-bold uppercase tracking-wider cursor-pointer"
            >
              Clear Search
            </Link>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-y-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col bg-white animate-pulse">
                <div className="bg-zinc-100 rounded-2xl aspect-[3/4] w-full mb-3" />
                <div className="h-3 bg-zinc-100 w-1/3 mb-2 rounded" />
                <div className="h-4 bg-zinc-100 w-3/4 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 border border-dashed border-red-200 rounded-2xl bg-red-50/10">
            <p className="font-heading font-bold text-red-500 uppercase tracking-wider text-sm">
              Failed to load products from server.
            </p>
          </div>
        ) : productsList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-y-12">
            {productsList.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-200 rounded-2xl">
            <p className="font-heading font-bold text-zinc-400 uppercase tracking-wider text-sm">
              No products found matching your selection.
            </p>
          </div>
        )}

        {/* Pagination Buttons */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16 sm:mt-24">
            
            <button
              onClick={() => {
                setCurrentPage(currentPage - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-zinc-200 rounded-full text-xs font-heading font-bold uppercase tracking-wider text-dark hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
            >
              Prev
            </button>

            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === currentPage;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 rounded-full text-xs font-heading font-bold flex items-center justify-center border transition duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-dark border-dark text-white' 
                        : 'border-zinc-200 text-zinc-500 hover:border-dark hover:text-dark'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-zinc-200 rounded-full text-xs font-heading font-bold uppercase tracking-wider text-dark hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
            >
              Next
            </button>

          </div>
        )}

      </div>
    </main>
  );
}

// Default export wraps in Suspense — required by Next.js when using useSearchParams
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <main className="w-full bg-white py-16 sm:py-24 min-h-[60vh] flex items-center justify-center">
        <p className="font-heading font-bold text-zinc-300 uppercase tracking-widest text-sm">Loading…</p>
      </main>
    }>
      <ProductsContent />
    </Suspense>
  );
}
