'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DashboardReviewsPage() {
  const queryClient = useQueryClient();

  // Fetch all reviews (allowed for admin role)
  const { data: reviews = [], isLoading, isError } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => apiClient.get('/api/reviews'),
  });

  // Delete Review Mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/api/reviews/${id}`),
    onSuccess: () => {
      toast.success('Review deleted and average rating updated');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete review');
    }
  });

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete this review by "${name}"?`)) {
      deleteReviewMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-body">
      <div>
        <h1 className="font-heading font-black text-3xl text-dark uppercase tracking-tight leading-none mb-1">Reviews</h1>
        <p className="font-body text-zinc-500 text-sm">Moderate, inspect, and delete review listings from the storefront.</p>
      </div>

      {isLoading ? (
        <div className="bg-white border border-zinc-150 p-12 rounded-2xl text-center">
          <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-heading font-bold text-zinc-400 uppercase text-[10px] tracking-wider">Retrieving reviews feed...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-heading font-bold text-xs uppercase tracking-wider">Error loading review logs.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-4.5">Review ID</th>
                  <th className="px-6 py-4.5">Customer Name</th>
                  <th className="px-6 py-4.5">Product Link</th>
                  <th className="px-6 py-4.5">Rating stars</th>
                  <th className="px-6 py-4.5">Commentary</th>
                  <th className="px-6 py-4.5 text-right uppercase">Mod actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <tr key={rev._id} className="hover:bg-zinc-50/50 transition-colors">
                      {/* ID */}
                      <td className="px-6 py-4.5 font-mono text-zinc-500 font-semibold select-all">{rev._id}</td>
                      
                      {/* Customer Name */}
                      <td className="px-6 py-4.5 font-bold text-dark">{rev.userName || 'Anonymous'}</td>
                      
                      {/* Product Link */}
                      <td className="px-6 py-4.5">
                        <Link
                          href={`/products/${rev.productId}`}
                          className="text-blue-500 hover:text-blue-600 underline font-semibold font-mono"
                        >
                          {rev.productId}
                        </Link>
                      </td>

                      {/* Stars */}
                      <td className="px-6 py-4.5">
                        <div className="flex text-[#C9FA75]">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < rev.rating ? 'text-[#C9FA75]' : 'text-zinc-200'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Comment */}
                      <td className="px-6 py-4.5 font-body text-zinc-650 max-w-sm truncate" title={rev.comment}>
                        {rev.comment}
                      </td>

                      {/* Delete Action */}
                      <td className="px-6 py-4.5 text-right">
                        <button
                          onClick={() => handleDelete(rev._id, rev.userName)}
                          disabled={deleteReviewMutation.isPending}
                          className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-heading font-bold uppercase tracking-wider text-[9px] transition cursor-pointer"
                        >
                          Delete Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-zinc-400 font-heading font-bold uppercase tracking-wider">No reviews recorded on database</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
