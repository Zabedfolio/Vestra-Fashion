'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import Image from 'next/image';
import { StarFill, Person, Smartphone, Envelope } from '@gravity-ui/icons';

export default function DashboardWishlistsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all wishlist leads
  const { data: leads = [], isLoading, isError } = useQuery({
    queryKey: ['admin-wishlist-leads'],
    queryFn: () => apiClient.get('/api/admin/wishlists'),
    refetchInterval: 5000, // Poll every 5s for real-time marketing leads!
  });

  const filteredLeads = leads.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.user?.name?.toLowerCase().includes(term) ||
      item.user?.email?.toLowerCase().includes(term) ||
      item.user?.phone?.toLowerCase().includes(term) ||
      item.product?.name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8 animate-fade-in font-body">
      <div>
        <h1 className="font-heading font-black text-3xl text-dark uppercase tracking-tight leading-none mb-1">Wishlist Leads</h1>
        <p className="font-body text-zinc-500 text-sm">Analyze wishlisted products by customer for targeted marketing outreach calls.</p>
      </div>

      {/* Search toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-white border border-zinc-150 focus:border-dark rounded-xl text-xs font-heading font-bold uppercase tracking-wider outline-none transition-colors"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-zinc-150 p-12 rounded-2xl text-center">
          <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-heading font-bold text-zinc-400 uppercase text-[10px] tracking-wider">Retrieving marketing leads...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-heading font-bold text-xs uppercase tracking-wider">Error loading wishlist leads.</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white border border-zinc-150 p-16 rounded-2xl text-center">
          <StarFill className="w-8 h-8 text-zinc-300 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-dark text-sm uppercase tracking-wide">No Wishlist Leads</h3>
          <p className="text-zinc-400 text-xs mt-1">No customers have added items to their wishlists yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-heading font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4.5">Customer Profile</th>
                  <th className="px-6 py-4.5">Wishlisted Product</th>
                  <th className="px-6 py-4.5">Price</th>
                  <th className="px-6 py-4.5">Added Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {filteredLeads.map((item) => (
                  <tr key={item._id} className="hover:bg-zinc-50/40 transition-colors">
                    
                    {/* Customer Profile info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-heading font-bold text-dark text-[10px] uppercase">
                          {item.user.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-heading font-bold text-dark uppercase">{item.user.name}</div>
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-zinc-450 font-mono text-[9px] mt-0.5">
                            <span className="flex items-center gap-1"><Envelope className="w-3 h-3" /> {item.user.email}</span>
                            <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> {item.user.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Product Details thumbnail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.product.image && (
                          <div className="relative w-9 h-11 rounded-lg overflow-hidden bg-zinc-50 border border-zinc-200 flex-shrink-0">
                            <Image 
                              src={item.product.image} 
                              alt={item.product.name} 
                              fill 
                              className="object-cover" 
                              sizes="36px" 
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-heading font-bold text-dark uppercase">{item.product.name}</div>
                          <div className="text-zinc-400 font-mono text-[9px] mt-0.5">Product ID: {item.productId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Price snapshot */}
                    <td className="px-6 py-4 font-heading font-bold text-dark">
                      ৳{item.product.price.toLocaleString()}
                    </td>

                    {/* Added Date */}
                    <td className="px-6 py-4 text-zinc-400 font-mono text-[10px]">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
