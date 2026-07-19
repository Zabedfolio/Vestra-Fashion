'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../../lib/auth-context';
import toast from 'react-hot-toast';
import { Star, StarFill, Xmark, CircleExclamation, CircleCheck } from '@gravity-ui/icons';

export default function CustomerOrdersPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();

  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    productId: '',
    productName: '',
    productImage: '',
    rating: 5,
    comment: ''
  });

  const [reportModal, setReportModal] = useState({
    isOpen: false,
    orderId: '',
    problem: '',
    imageFile: null,
    isUploading: false
  });

  // Fetch orders
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiClient.get('/api/orders'),
    enabled: !!user,
  });

  // Fetch customer's own reviews
  const { data: myReviews = [] } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => apiClient.get('/api/reviews?myReviews=true'),
    enabled: !!user,
  });

  // Helper to check product review status
  const getProductReviewStatus = (productId) => {
    const review = myReviews.find(r => r.productId === productId);
    return review ? review.status : null; // 'pending' | 'approved' | null
  };

  // Submit Review Mutation
  const submitReviewMutation = useMutation({
    mutationFn: (newReview: { productId: string; rating: number; comment: string }) => apiClient.post('/api/reviews', newReview),
    onSuccess: () => {
      toast.success('Review submitted! It will appear after admin approval.', { duration: 5000 });
      setReviewModal((prev) => ({ ...prev, isOpen: false }));
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to submit review');
    }
  });

  // Submit Report Mutation
  const submitReportMutation = useMutation({
    mutationFn: (newReport: { orderId: string; problem: string; image: string | null }) => apiClient.post('/api/reports', newReport),
    onSuccess: () => {
      toast.success('Report submitted successfully. Our support team will review it shortly.', { duration: 5000 });
      setReportModal({
        isOpen: false,
        orderId: '',
        problem: '',
        imageFile: null,
        isUploading: false
      });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to submit report');
    }
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewModal.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    submitReviewMutation.mutate({
      productId: reviewModal.productId,
      rating: reviewModal.rating,
      comment: reviewModal.comment
    });
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportModal.problem.trim()) {
      toast.error('Please describe the problem');
      return;
    }

    setReportModal((prev) => ({ ...prev, isUploading: true }));
    let uploadedImageUrl = null;

    try {
      if (reportModal.imageFile) {
        const formData = new FormData();
        formData.append('image', reportModal.imageFile);
        
        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY || '9ef74b5ce0190996e1b21ee6f99e77be'}`, {
          method: 'POST',
          body: formData
        });

        if (!imgbbRes.ok) {
          throw new Error('Image upload to ImgBB failed');
        }

        const imgbbData = await imgbbRes.json();
        uploadedImageUrl = imgbbData.data?.url;
      }

      await submitReportMutation.mutateAsync({
        orderId: reportModal.orderId,
        problem: reportModal.problem,
        image: uploadedImageUrl
      });
    } catch (err) {
      toast.error(err.message || 'Something went wrong while submitting the report');
    } finally {
      setReportModal((prev) => ({ ...prev, isUploading: false }));
    }
  };

  if (isAuthLoading || (user && isOrdersLoading)) {
    return (
      <main className="w-full bg-white py-16 sm:py-24 min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-dark border-t-transparent rounded-full animate-spin" />
          <p className="font-heading font-bold text-zinc-300 uppercase tracking-widest text-xs">Loading orders...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="w-full bg-white py-24 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center space-y-6">
          <div className="w-16 h-16 bg-zinc-50 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-150">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">Track Your Orders</h1>
          <p className="font-body text-zinc-500 text-sm leading-relaxed">
            Please log in to view and track your purchase history and order status.
          </p>
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-block bg-dark text-white hover:bg-[#C9FA75] hover:text-dark px-10 py-3.5 rounded-xl font-heading font-bold tracking-widest text-xs uppercase transition-colors duration-200"
            >
              Log In Now
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full">Paid</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full">Shipped</span>;
      case 'delivered':
        return <span className="bg-zinc-100 text-dark text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full">Delivered</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full">Cancelled</span>;
      default:
        return <span className="bg-zinc-100 text-zinc-600 text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full">Pending</span>;
    }
  };

  return (
    <main className="w-full bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-12 border-b border-zinc-100 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-heading font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
              Purchase History
            </p>
            <h1 className="font-heading font-black text-4xl text-dark uppercase tracking-tight leading-none">
              My <span className="text-[#C9FA75]">Orders</span>
            </h1>
          </div>
          <Link
            href="/products"
            className="text-xs font-heading font-bold text-dark hover:underline uppercase tracking-wider cursor-pointer"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Orders list */}
        {orders.length > 0 ? (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Order Top Header Summary */}
                <div className="bg-zinc-50 border-b border-zinc-100 px-6 py-5 flex flex-wrap justify-between items-center gap-4 text-xs">
                  <div className="flex gap-6 flex-wrap">
                    <div>
                      <p className="font-heading font-bold text-zinc-400 uppercase tracking-wider mb-1">Order Placed</p>
                      <p className="font-semibold text-dark">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="font-heading font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Value</p>
                      <p className="font-bold text-dark">৳{order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-heading font-bold text-zinc-400 uppercase tracking-wider mb-1">Order ID</p>
                      <p className="font-semibold text-zinc-500 font-mono select-all">{order._id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setReportModal({
                        isOpen: true,
                        orderId: order._id,
                        problem: '',
                        imageFile: null,
                        isUploading: false
                      })}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 text-red-500 bg-white rounded-lg text-[9px] font-heading font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      <CircleExclamation className="w-3.5 h-3.5" />
                      Report Issue
                    </button>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Items list */}
                <div className="divide-y divide-zinc-100 px-6 py-4">
                  {order.items.map((item, idx) => {
                    const reviewStatus = getProductReviewStatus(item.productId);
                    return (
                      <div key={`${item.productId}-${idx}`} className="flex gap-4 py-4 first:pt-2 last:pb-2">
                        <div className="relative w-16 h-22 rounded-xl overflow-hidden bg-[#F0F0F0] flex-shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                          ) : (
                            <div className="w-full h-full bg-zinc-200" />
                          )}
                        </div>
                        <div className="flex-grow flex flex-col justify-between py-0.5 text-xs sm:text-sm">
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-heading font-bold text-dark line-clamp-1">{item.name}</h4>
                              <span className="font-heading font-bold text-dark shrink-0">
                                ৳{(item.price * item.qty).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2.5 mt-1 text-[10px] text-zinc-400 font-body uppercase">
                              <span>Qty: {item.qty}</span>
                              {item.color && <span>Color: {item.color}</span>}
                              {item.size && <span>Size: {item.size}</span>}
                            </div>
                          </div>

                          {order.status === 'delivered' && (
                            <div className="mt-2.5">
                              {reviewStatus === 'approved' ? (
                                <button
                                  disabled
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-100 text-zinc-400 border border-zinc-200 rounded-lg text-[9px] font-heading font-bold uppercase tracking-wider"
                                >
                                  <CircleCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  Reviewed
                                </button>
                              ) : reviewStatus === 'pending' ? (
                                <button
                                  disabled
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[9px] font-heading font-bold uppercase tracking-wider"
                                >
                                  Pending Approval
                                </button>
                              ) : (
                                <button
                                  onClick={() => setReviewModal({
                                    isOpen: true,
                                    productId: item.productId,
                                    productName: item.name,
                                    productImage: item.image,
                                    rating: 5,
                                    comment: ''
                                  })}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-zinc-250 hover:bg-dark hover:text-white hover:border-dark rounded-lg text-[9px] font-heading font-bold uppercase tracking-wider transition cursor-pointer text-dark bg-white"
                                >
                                  Write Review
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Shipping Address Banner */}
                {order.shippingAddress && (
                  <div className="bg-zinc-50/50 border-t border-zinc-100 px-6 py-4 text-xs font-body text-zinc-500">
                    <p className="font-heading font-bold uppercase tracking-wider text-zinc-400 mb-1">Delivery Address</p>
                    <p>{order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                  </div>
                )}

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-200 rounded-2xl">
            <svg className="w-12 h-12 text-zinc-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <h3 className="font-heading font-bold text-zinc-400 uppercase text-sm tracking-wider">No orders found</h3>
            <p className="font-body text-zinc-400 text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
              You haven't placed any orders yet. Explore our shop to build your minimal aesthetic.
            </p>
          </div>
        )}

      </div>

      {/* Write a Review Modal */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-zinc-150 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setReviewModal((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 text-zinc-400 hover:text-dark transition cursor-pointer"
            >
              <Xmark className="w-5 h-5" />
            </button>

            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-[9px] font-heading font-bold tracking-widest text-[#C9FA75] bg-dark inline-block px-2.5 py-1 rounded uppercase">
                  Write Product Review
                </p>
                <h3 className="font-heading font-black text-xl text-dark uppercase tracking-tight mt-2">
                  Share Your Feedback
                </h3>
              </div>

              {/* Product Brief */}
              <div className="flex gap-4 p-3 bg-zinc-50 border border-zinc-150 rounded-xl">
                <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-zinc-200 shrink-0">
                  {reviewModal.productImage ? (
                    <Image src={reviewModal.productImage} alt={reviewModal.productName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-300" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-heading font-bold text-xs text-dark line-clamp-1">{reviewModal.productName}</h4>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5 uppercase">ID: {reviewModal.productId}</p>
                </div>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-body">
                {/* Rating selection */}
                <div className="space-y-2">
                  <span className="font-heading font-bold text-[10px] text-zinc-400 uppercase tracking-wider block">Rating Star</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewModal((prev) => ({ ...prev, rating: star }))}
                        className="transition cursor-pointer transform hover:scale-110"
                      >
                        {star <= reviewModal.rating ? (
                          <StarFill className="w-6 h-6 text-[#C9FA75]" />
                        ) : (
                          <Star className="w-6 h-6 text-zinc-200 hover:text-zinc-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Commentary */}
                <div className="space-y-1.5">
                  <label className="font-heading font-bold text-[10px] text-zinc-400 uppercase tracking-wider block">Your Review</label>
                  <textarea
                    rows={4}
                    value={reviewModal.comment}
                    onChange={(e) => setReviewModal((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="Tell us about the fabric, sizing, quality, and fit..."
                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-dark text-xs transition duration-150 resize-none font-body leading-relaxed"
                  />
                </div>

                {/* Triggers */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModal((prev) => ({ ...prev, isOpen: false }))}
                    className="flex-1 px-4 py-3 border border-zinc-200 hover:border-dark rounded-xl font-heading font-bold uppercase tracking-wider text-[10px] transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitReviewMutation.isPending}
                    className="flex-1 px-4 py-3 bg-dark text-white hover:bg-[#C9FA75] hover:text-dark disabled:opacity-50 rounded-xl font-heading font-bold uppercase tracking-wider text-[10px] transition cursor-pointer text-center"
                  >
                    {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Report Order Issue Modal */}
      {reportModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-zinc-150 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setReportModal((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 text-zinc-400 hover:text-dark transition cursor-pointer"
            >
              <Xmark className="w-5 h-5" />
            </button>

            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-[9px] font-heading font-bold tracking-widest text-red-500 bg-red-50 inline-block px-2.5 py-1 rounded uppercase">
                  Report Order Issue
                </p>
                <h3 className="font-heading font-black text-xl text-dark uppercase tracking-tight mt-2">
                  Submit Order dispute
                </h3>
              </div>

              {/* Pre-filled auto details */}
              <div className="space-y-2 p-3.5 bg-zinc-50 border border-zinc-150 rounded-xl text-[10px] font-mono uppercase text-zinc-550">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-bold text-dark">{reportModal.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Name:</span>
                  <span className="font-bold text-dark">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer ID:</span>
                  <span className="font-bold text-dark">{user._id}</span>
                </div>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs font-body">
                {/* Problem description */}
                <div className="space-y-1.5">
                  <label className="font-heading font-bold text-[10px] text-zinc-400 uppercase tracking-wider block">Describe the issue</label>
                  <textarea
                    rows={4}
                    required
                    value={reportModal.problem}
                    onChange={(e) => setReportModal((prev) => ({ ...prev, problem: e.target.value }))}
                    placeholder="Tell us what is wrong with this order (e.g. wrong size, damaged packaging, missing item...)"
                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-dark text-xs transition duration-150 resize-none font-body leading-relaxed"
                  />
                </div>

                {/* Optional Image Upload */}
                <div className="space-y-1.5">
                  <label className="font-heading font-bold text-[10px] text-zinc-400 uppercase tracking-wider block">Attachment (Optional Picture)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReportModal((prev) => ({ ...prev, imageFile: e.target.files[0] }))}
                    className="w-full text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-heading file:font-bold file:uppercase file:tracking-wider file:bg-zinc-150 file:text-dark hover:file:bg-[#C9FA75] file:cursor-pointer text-[10px]"
                  />
                </div>

                {/* Triggers */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModal((prev) => ({ ...prev, isOpen: false }))}
                    className="flex-1 px-4 py-3 border border-zinc-200 hover:border-dark rounded-xl font-heading font-bold uppercase tracking-wider text-[10px] transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportModal.isUploading || submitReportMutation.isPending}
                    className="flex-1 px-4 py-3 bg-dark text-white hover:bg-[#C9FA75] hover:text-dark disabled:opacity-50 rounded-xl font-heading font-bold uppercase tracking-wider text-[10px] transition cursor-pointer text-center"
                  >
                    {reportModal.isUploading ? 'Uploading...' : submitReportMutation.isPending ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
