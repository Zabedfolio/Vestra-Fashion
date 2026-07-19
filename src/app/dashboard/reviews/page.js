'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Star, StarFill, CircleCheck, TrashBin } from '@gravity-ui/icons';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => {
        const Icon = i < rating ? StarFill : Star;
        return (
          <Icon
            key={i}
            className={`w-3.5 h-3.5 ${i < rating ? 'text-[#C9FA75]' : 'text-zinc-200'}`}
          />
        );
      })}
    </div>
  );
}

export default function DashboardReviewsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved'

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Fetch pending reviews
  const { data: pendingReviews = [], isLoading: isPendingLoading } = useQuery({
    queryKey: ['admin-reviews', 'pending'],
    queryFn: () => apiClient.get('/api/reviews?status=pending'),
    refetchInterval: 5000,
  });

  // Fetch approved reviews
  const { data: approvedReviews = [], isLoading: isApprovedLoading } = useQuery({
    queryKey: ['admin-reviews', 'approved'],
    queryFn: () => apiClient.get('/api/reviews?status=approved'),
    refetchInterval: 5000,
  });

  // Approve Review Mutation
  const approveReviewMutation = useMutation({
    mutationFn: (id) => apiClient.patch(`/api/reviews/${id}/approve`, {}),
    onSuccess: () => {
      toast.success('Review approved and is now live on the storefront!');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to approve review');
    }
  });

  // Delete Review Mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/api/reviews/${id}`),
    onSuccess: () => {
      toast.success('Review deleted and product rating updated');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete review');
    }
  });

  const handleApprove = (id, name) => {
    setConfirmModal({
      isOpen: true,
      title: 'Approve Review',
      message: `Approve this review by "${name}"? It will be immediately visible on the product page and included in the rating calculation.`,
      onConfirm: () => {
        approveReviewMutation.mutate(id);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDelete = (id, name) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Review',
      message: `Delete this review by "${name}"? This action cannot be undone and will update the product rating.`,
      onConfirm: () => {
        deleteReviewMutation.mutate(id);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const activeReviews = activeTab === 'pending' ? pendingReviews : approvedReviews;
  const isLoading = activeTab === 'pending' ? isPendingLoading : isApprovedLoading;

  return (
    <div className="space-y-8 animate-fade-in font-body">
      {/* Header */}
      <div>
        <h1 className="font-heading font-black text-3xl text-dark uppercase tracking-tight leading-none mb-1">Reviews</h1>
        <p className="font-body text-zinc-500 text-sm">Moderate customer reviews before they appear on the storefront.</p>
      </div>

      {/* Tabs + Badge counts */}
      <div className="flex items-center gap-2 border-b border-zinc-150">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-5 py-3 text-[10px] font-heading font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer -mb-px ${
            activeTab === 'pending'
              ? 'border-dark text-dark'
              : 'border-transparent text-zinc-400 hover:text-dark'
          }`}
        >
          Pending Approval
          {pendingReviews.length > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-[9px] font-black text-dark">
              {pendingReviews.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`flex items-center gap-2 px-5 py-3 text-[10px] font-heading font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer -mb-px ${
            activeTab === 'approved'
              ? 'border-dark text-dark'
              : 'border-transparent text-zinc-400 hover:text-dark'
          }`}
        >
          Approved & Live
          {approvedReviews.length > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-[9px] font-black text-emerald-700">
              {approvedReviews.length}
            </span>
          )}
        </button>
      </div>

      {/* Info Banner for pending tab */}
      {activeTab === 'pending' && pendingReviews.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1" />
          <p className="text-xs font-body text-amber-700">
            <span className="font-bold">{pendingReviews.length} review{pendingReviews.length !== 1 ? 's' : ''} awaiting your approval.</span>{' '}
            Approved reviews appear live on the product page and are factored into the rating calculation.
          </p>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="bg-white border border-zinc-150 p-12 rounded-2xl text-center">
          <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-heading font-bold text-zinc-400 uppercase text-[10px] tracking-wider">Retrieving reviews...</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Commentary</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {activeReviews.length > 0 ? (
                  activeReviews.map((rev) => (
                    <tr key={rev._id} className="hover:bg-zinc-50/50 transition-colors">
                      {/* Customer */}
                      <td className="px-6 py-4 font-bold text-dark whitespace-nowrap">
                        {rev.userName || 'Anonymous'}
                      </td>

                      {/* Product Link */}
                      <td className="px-6 py-4">
                        <Link
                          href={`/products/${rev.productId}`}
                          className="text-blue-500 hover:text-blue-600 underline font-semibold font-mono text-[10px]"
                        >
                          {rev.productId}
                        </Link>
                      </td>

                      {/* Stars */}
                      <td className="px-6 py-4">
                        <StarRating rating={rev.rating} />
                      </td>

                      {/* Comment */}
                      <td className="px-6 py-4 font-body text-zinc-600 max-w-xs truncate" title={rev.comment}>
                        {rev.comment}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-zinc-400 whitespace-nowrap font-mono">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {activeTab === 'pending' && (
                            <button
                              onClick={() => handleApprove(rev._id, rev.userName)}
                              disabled={approveReviewMutation.isPending}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg font-heading font-bold uppercase tracking-wider text-[9px] transition cursor-pointer disabled:opacity-50"
                            >
                              <CircleCheck className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(rev._id, rev.userName)}
                            disabled={deleteReviewMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-heading font-bold uppercase tracking-wider text-[9px] transition cursor-pointer disabled:opacity-50"
                          >
                            <TrashBin className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <CircleCheck className="w-10 h-10 text-zinc-200" />
                        <p className="font-heading font-bold text-xs text-zinc-400 uppercase tracking-wider">
                          {activeTab === 'pending' ? 'No reviews pending approval' : 'No approved reviews yet'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        isDangerous={activeTab === 'approved' || confirmModal.title === 'Delete Review'}
      />
    </div>
  );
}
