'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { CircleExclamation, CircleCheck } from '@gravity-ui/icons';

export default function DashboardReportsPage() {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch all customer reports
  const { data: reports = [], isLoading, isError } = useQuery({
    queryKey: ['admin-reports-list'],
    queryFn: () => apiClient.get('/api/reports'),
    refetchInterval: 5000,
  });

  // Update report status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => apiClient.patch(`/api/reports/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Report status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-reports-list'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update report status');
    }
  });

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-100 text-emerald-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-body">
      {/* Header */}
      <div>
        <h1 className="font-heading font-black text-3xl text-dark uppercase tracking-tight leading-none mb-1">Reports</h1>
        <p className="font-body text-zinc-500 text-sm">Review, monitor, and resolve customer orders disputes and issues.</p>
      </div>

      {isLoading ? (
        <div className="bg-white border border-zinc-150 p-12 rounded-2xl text-center">
          <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-heading font-bold text-zinc-400 uppercase text-[10px] tracking-wider">Retrieving dispute feeds...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-heading font-bold text-xs uppercase tracking-wider">Error loading reports feed.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-4.5">Customer details</th>
                  <th className="px-6 py-4.5">Order ID</th>
                  <th className="px-6 py-4.5">Issue/Problem Description</th>
                  <th className="px-6 py-4.5">Attachment</th>
                  <th className="px-6 py-4.5">Status</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <tr key={report._id} className="hover:bg-zinc-50/50 transition-colors">
                      {/* Customer Details */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-dark">{report.userName}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5 normal-case font-normal">{report.userEmail}</div>
                        <div className="text-[9px] text-zinc-400 font-mono mt-0.5 select-all">User ID: {report.userId}</div>
                      </td>

                      {/* Order ID */}
                      <td className="px-6 py-4 font-mono text-zinc-500 font-semibold select-all">
                        {report.orderId}
                      </td>

                      {/* Problem Description */}
                      <td className="px-6 py-4 font-body text-zinc-650 max-w-sm whitespace-pre-wrap leading-relaxed">
                        {report.problem}
                      </td>

                      {/* Attached Image */}
                      <td className="px-6 py-4">
                        {report.image ? (
                          <div
                            onClick={() => setSelectedImage(report.image)}
                            className="relative w-12 h-16 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 cursor-pointer hover:opacity-80 transition duration-150"
                          >
                            <Image src={report.image} alt="Report attachment" fill className="object-cover" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-300 italic uppercase">No attachment</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-heading font-bold uppercase tracking-wider ${getStatusClass(report.status)}`}>
                          {report.status}
                        </span>
                      </td>

                      {/* Resolve Action */}
                      <td className="px-6 py-4 text-right">
                        <select
                          value={report.status}
                          onChange={(e) => handleStatusChange(report._id, e.target.value)}
                          disabled={updateStatusMutation.isPending}
                          className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 text-[10px] font-heading font-bold uppercase tracking-wider rounded-lg outline-none cursor-pointer focus:border-dark"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In-Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <CircleCheck className="w-10 h-10 text-zinc-200" />
                        <p className="font-heading font-bold text-xs text-zinc-400 uppercase tracking-wider">No customer disputes reported</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Image Preview Overlay Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="max-w-3xl w-full max-h-[85vh] relative flex flex-col items-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#C9FA75] transition cursor-pointer p-2 flex items-center gap-1.5 font-heading font-bold text-xs uppercase tracking-wider"
            >
              Close [X]
            </button>
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img src={selectedImage} alt="Large Attachment Preview" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
