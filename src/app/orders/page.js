'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../../lib/auth-context';

export default function CustomerOrdersPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  // Fetch orders
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiClient.get('/api/orders'),
    enabled: !!user,
  });

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
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Items list */}
                <div className="divide-y divide-zinc-100 px-6 py-4">
                  {order.items.map((item, idx) => (
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
                      </div>
                    </div>
                  ))}
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
    </main>
  );
}
