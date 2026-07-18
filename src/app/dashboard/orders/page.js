'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import toast from 'react-hot-toast';

export default function DashboardOrdersPage() {
  const queryClient = useQueryClient();

  // Fetch all orders
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => apiClient.get('/api/orders?all=true'),
  });

  // Modify Order Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => apiClient.patch(`/api/orders/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Order status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update status');
    }
  });

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-zinc-100 text-dark';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-zinc-100 text-zinc-650';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-body">
      <div>
        <h1 className="font-heading font-black text-3xl text-dark uppercase tracking-tight leading-none mb-1">Orders</h1>
        <p className="font-body text-zinc-500 text-sm">Track customer purchases and update shipping and delivery logs.</p>
      </div>

      {isLoading ? (
        <div className="bg-white border border-zinc-150 p-12 rounded-2xl text-center">
          <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-heading font-bold text-zinc-400 uppercase text-[10px] tracking-wider">Retrieving purchases...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-heading font-bold text-xs uppercase tracking-wider">Error loading orders feed.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-4.5">Order ID</th>
                  <th className="px-6 py-4.5">Date</th>
                  <th className="px-6 py-4.5">Customer Details</th>
                  <th className="px-6 py-4.5">Items Purchased</th>
                  <th className="px-6 py-4.5">Total Bill</th>
                  <th className="px-6 py-4.5">Status Badge</th>
                  <th className="px-6 py-4.5 text-right">Modify Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors">
                      {/* ID */}
                      <td className="px-6 py-4 font-mono text-zinc-500 font-semibold select-all">{order._id}</td>
                      
                      {/* Date */}
                      <td className="px-6 py-4 text-zinc-500 font-semibold">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      
                      {/* Customer */}
                      <td className="px-6 py-4 font-semibold">
                        <div>{order.userName || 'Anonymous'}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5 normal-case font-normal">{order.userEmail}</div>
                      </td>
                      
                      {/* Items */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {order.items?.map((item, i) => (
                            <div key={i} className="text-[11px] text-zinc-600 font-medium">
                              • {item.name} <span className="text-zinc-400">({item.qty}x, Size {item.size || 'N/A'}, {item.color || 'N/A'})</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 font-black text-dark">৳{order.total.toLocaleString()}</td>
                      
                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-heading font-bold uppercase tracking-wider ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updateStatusMutation.isPending}
                          className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 text-[10px] font-heading font-bold uppercase tracking-wider rounded-lg outline-none cursor-pointer focus:border-dark"
                        >
                          <option value="pending">Pending</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          {order.status !== 'pending' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <option value={order.status}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</option>
                          )}
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-zinc-400 font-heading font-bold uppercase tracking-wider">No customer orders recorded</td>
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
