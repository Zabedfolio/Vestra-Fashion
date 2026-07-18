'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '../../../lib/apiClient';
import { useAuth } from '../../../lib/auth-context';
import ProductCard from '../../../components/ui/ProductCard';
import ProductUnavailable from '../../../components/ui/ProductUnavailable';
import { addToCart } from '../../../utils/cart';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const productId = params.id;

  // 1. Fetch Product details from API
  const { data: product, isLoading: isProductLoading, isError: isProductError } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => apiClient.get(`/api/products/${productId}`),
    enabled: !!productId,
  });

  // 2. Fetch Reviews from API
  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => apiClient.get(`/api/reviews?productId=${productId}`),
    enabled: !!productId,
  });

  // 3. Fetch AI Recommendations from API
  const { data: aiRecsData, isLoading: isRecsLoading } = useQuery({
    queryKey: ['recommendations', productId],
    queryFn: () => apiClient.post('/api/ai/recommend', { productId }),
    enabled: !!productId && !!product,
  });

  // State variables
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Sync state once product loads
  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedColor(product.colors?.[0] || '');
      setSelectedSize(product.sizes?.[0] || '');
    }
  }, [product]);

  // Submit Review Mutation
  const submitReviewMutation = useMutation({
    mutationFn: (newReview) => apiClient.post('/api/reviews', newReview),
    onSuccess: () => {
      toast.success('Thank you for your review!');
      setReviewComment('');
      setReviewRating(5);
      // Refetch reviews and product data to update the rating and count
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit review');
    }
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to write a review');
      router.push('/login');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Please add a comment');
      return;
    }
    submitReviewMutation.mutate({
      productId,
      rating: reviewRating,
      comment: reviewComment,
    });
  };

  if (isProductLoading) {
    return (
      <main className="w-full bg-white py-16 sm:py-24 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-dark border-t-transparent rounded-full animate-spin" />
          <p className="font-heading font-bold text-zinc-400 uppercase tracking-widest text-xs">Loading essentials...</p>
        </div>
      </main>
    );
  }

  if (isProductError || !product) {
    return <ProductUnavailable />;
  }

  const recommendationsList = aiRecsData?.recommendations || [];

  return (
    <main className="w-full bg-white py-16 sm:py-24 animate-fade-in">
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
                src={selectedImage || product.image}
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
                    key={img + i}
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
              
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark uppercase tracking-tight mb-4 leading-none">
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

              {/* Rating stars indicator */}
              <div className="flex items-center gap-1.5 mt-3">
                <div className="flex text-dark">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(product.rating || 4.5) ? 'text-[#C9FA75]' : 'text-zinc-200'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs font-heading font-bold text-zinc-500">
                  {product.rating || '4.5'} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-b border-zinc-100 py-6">
              <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2 font-heading">Description</h3>
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
                onClick={() => {
                  const mappedProduct = {
                    id: product._id,
                    name: product.name,
                    brand: product.brand,
                    image: product.image,
                    price: product.price,
                  };
                  addToCart(mappedProduct, quantity, selectedColor, selectedSize);
                }}
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

        {/* AI Recommendations Curations */}
        {!isRecsLoading && recommendationsList.length > 0 && (
          <div className="border-t border-zinc-100 pt-16 mb-16">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="text-[10px] font-heading font-bold tracking-[0.25em] text-[#C9FA75] bg-dark px-3 py-1.5 rounded-full inline-block uppercase mb-3">
                  AI Curator Selection
                </p>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-dark uppercase tracking-tight leading-none">
                  Styles Well <span className="text-[#C9FA75]">With</span>
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {recommendationsList.map((rec) => (
                <div key={rec._id} className="flex flex-col">
                  <ProductCard product={rec} />
                  {rec.recommendationReason && (
                    <div className="mt-3.5 bg-zinc-50 border border-zinc-150 p-3 rounded-xl text-left">
                      <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-1">Stylist Tip</p>
                      <p className="font-body text-xs text-zinc-600 leading-normal font-medium">{rec.recommendationReason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="border-t border-zinc-100 pt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Reviews Sidebar (Rating Overview & Submit review form) */}
          <div className="space-y-8">
            <div>
              <h2 className="font-heading font-black text-2xl text-dark uppercase tracking-tight leading-none mb-3">
                Reviews
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-heading font-black text-dark">{product.rating || '4.5'}</span>
                <div>
                  <div className="flex text-[#C9FA75] text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.round(product.rating || 4.5) ? 'text-[#C9FA75]' : 'text-zinc-200'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mt-0.5">Based on {reviews.length} reviews</p>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-6 sm:p-8">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-dark mb-4">Write a Review</h3>
              
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Stars select */}
                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-2xl outline-none focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                        >
                          <span className={star <= reviewRating ? 'text-[#C9FA75]' : 'text-zinc-200'}>★</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label htmlFor="comment" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Your Review</label>
                    <textarea
                      id="comment"
                      required
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts on design, fit, and comfort..."
                      className="w-full p-4 bg-white border border-zinc-200 focus:border-dark rounded-xl text-sm font-body outline-none transition-colors duration-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitReviewMutation.isPending}
                    className="w-full bg-dark text-white hover:bg-[#C9FA75] hover:text-dark py-3 rounded-xl font-heading font-bold tracking-widest text-[10px] uppercase transition-colors duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="font-body text-xs text-zinc-500 mb-4">You must be signed in to leave a review.</p>
                  <Link
                    href="/login"
                    className="inline-block bg-dark text-white hover:bg-[#C9FA75] hover:text-dark px-6 py-2.5 rounded-xl font-heading font-bold tracking-widest text-[10px] uppercase transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-400 mb-4">Customer Opinions</h3>
            
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border border-zinc-150 p-6 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="font-heading font-bold text-sm text-dark">{review.userName || 'Anonymous'}</span>
                        <span className="text-[10px] text-zinc-400 font-body">
                          {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      
                      <div className="flex text-[#C9FA75] text-xs mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-[#C9FA75]' : 'text-zinc-200'}>
                            ★
                          </span>
                        ))}
                      </div>

                      <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-zinc-200 rounded-2xl">
                <p className="font-heading font-bold text-zinc-400 uppercase tracking-wider text-xs">
                  No reviews for this product yet.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
