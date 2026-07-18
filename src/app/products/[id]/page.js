'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import toast from 'react-hot-toast';
import { products } from '../../../data/products';
import ProductCard from '../../../components/ui/ProductCard';
import ProductUnavailable from '../../../components/ui/ProductUnavailable';
import { addToCart } from '../../../utils/cart';

export default function ProductDetailPage() {
  // 1. Get dynamic product ID from URL params simply
  const params = useParams();
  const productId = parseInt(params.id, 10);

  // 2. Find product in data array
  const product = products.find((p) => p.id === productId);

  // 3. Render unavailable card if not found
  if (!product) {
    return <ProductUnavailable />;
  }

  // 4. Set up simple state variables
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // 5. Get related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="w-full bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb path */}
        <nav className="mb-10 text-xs font-heading font-bold uppercase tracking-wider text-zinc-400">
          <Link href="/" className="hover:text-dark">Home</Link>
          <span className="mx-2.5">/</span>
          <Link href="/products" className="hover:text-dark">Products</Link>
          <span className="mx-2.5">/</span>
          <span className="text-dark">{product.name}</span>
        </nav>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
          
          {/* Main Image & Thumbnails */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-[#F0F0F0] aspect-[3/4] w-full">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden bg-[#F0F0F0] flex-shrink-0 border-2 cursor-pointer transition-all duration-200 ${
                      selectedImage === img ? 'border-dark scale-98' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-heading font-bold bg-dark text-white px-3 py-1 rounded-full uppercase">
                  {product.brand}
                </span>
                <span className="text-[10px] font-heading font-semibold text-zinc-400 uppercase tracking-wider">
                  {product.category}
                </span>
              </div>
              
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark uppercase tracking-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-heading font-black text-dark">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-zinc-400 line-through text-sm font-body">
                    ৳{product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-b border-zinc-100 py-6">
              <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Description</h3>
              <p className="font-body text-zinc-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color & Size Selectors */}
            <div className="space-y-6">
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Color: <span className="text-dark font-semibold">{selectedColor}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-4.5 py-2 rounded-full text-xs font-body font-semibold cursor-pointer border transition-all duration-200 ${
                          selectedColor === color
                            ? 'bg-dark border-dark text-white'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-dark hover:text-dark'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Size: <span className="text-dark font-semibold">{selectedSize}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-heading font-bold text-sm cursor-pointer border transition-all duration-200 ${
                          selectedSize === size
                            ? 'bg-dark border-dark text-white'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-dark hover:text-dark'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-4">
                
                {/* Quantity */}
                <div className="flex items-center border border-zinc-200 rounded-xl px-2 bg-zinc-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-bold text-dark hover:bg-zinc-200/50 transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-heading font-bold text-sm text-dark">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-bold text-dark hover:bg-zinc-200/50 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => {
                    setIsWishlisted(!isWishlisted);
                    if (!isWishlisted) {
                      toast.success('Added to wishlist!');
                    } else {
                      toast('Removed from wishlist');
                    }
                  }}
                  className="w-12 h-12 border border-zinc-200 rounded-xl flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 transition cursor-pointer"
                >
                  <svg
                    className={`w-5 h-5 transition-colors ${
                      isWishlisted ? 'text-[#C9FA75] fill-[#C9FA75]' : 'text-dark fill-none'
                    }`}
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
                className="w-full bg-dark text-white hover:bg-[#C9FA75] hover:text-dark py-4 rounded-xl font-heading font-bold tracking-widest text-xs uppercase transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Bag
              </button>
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-zinc-100 pt-16">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="text-[10px] font-heading font-bold tracking-[0.25em] text-zinc-400 uppercase mb-2">
                  Complete your look
                </p>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-dark uppercase tracking-tight leading-none">
                  Related <span className="text-[#C9FA75]">Products</span>
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
