'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../../lib/auth-context';
import Link from 'next/link';
import Image from 'next/image';
import { CircleExclamation, CircleCheck } from '@gravity-ui/icons';

export default function CustomerReportsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch customer's own reports
  const { data: reports = [], isLoading: isReportsLoading, isError } = useQuery({
    queryKey: ['my-reports-list'],
    queryFn: () => apiClient.get('/api/reports'),
    enabled: !!user,
  });

  if (isAuthLoading || (user && isReportsLoading)) {
    return (
      <main className="w-full bg-white py-16 sm:py-24 min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-dark border-t-transparent rounded-full animate-spin" />
          <p className="font-heading font-bold text-zinc-300 uppercase tracking-widest text-xs">Loading reports...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="w-full bg-white py-24 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center space-y-6">
          <div className="w-16 h-16 bg-zinc-50 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-150">
            <CircleExclamation className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">Track Your Disputes</h1>
          <p className="font-body text-zinc-500 text-sm leading-relaxed">
            Please log in to view the resolution progress of your order disputes.
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
      case 'resolved':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full">Resolved</span>;
      case 'in-progress':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full">In-Progress</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full">Pending</span>;
    }
  };

  return (
    <main className="w-full bg-white py-16 sm:py-24 font-body text-dark min-h-[80vh]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-12 border-b border-zinc-100 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-heading font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
              Support Center
            </p>
            <h1 className="font-heading font-black text-4xl text-dark uppercase tracking-tight leading-none">
              Dispute <span className="text-[#C9FA75]">Reports</span>
            </h1>
          </div>
          <Link
            href="/orders"
            className="text-xs font-heading font-bold text-dark hover:underline uppercase tracking-wider cursor-pointer"
          >
            ← View My Orders
          </Link>
        </div>

        {isError ? (
          <div className="bg-red-50 border border-red-200 text-red-750 p-6 rounded-2xl text-center">
            <p className="font-heading font-bold text-xs uppercase tracking-wider">Error loading dispute tickets.</p>
          </div>
        ) : reports.length > 0 ? (
          <div className="space-y-6">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-sm p-6 space-y-4"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-heading font-bold text-zinc-400 uppercase tracking-wider">
                      Report Placed: {new Date(report.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <div className="text-xs font-mono text-zinc-550 select-all">
                      Ticket ID: {report._id}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase">Order ID: {report.orderId}</span>
                    {getStatusBadge(report.status)}
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-grow space-y-2">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-400">Issue Description</h4>
                    <p className="text-xs text-zinc-650 font-body leading-relaxed whitespace-pre-wrap">
                      {report.problem}
                    </p>
                  </div>

                  {report.image && (
                    <div
                      onClick={() => setSelectedImage(report.image)}
                      className="relative w-20 h-28 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-150 shrink-0 cursor-pointer hover:opacity-90 transition duration-150"
                    >
                      <Image src={report.image} alt="Dispute attachment" fill className="object-cover" sizes="80px" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-200 rounded-2xl">
            <CircleCheck className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-zinc-400 uppercase text-sm tracking-wider">No disputes filed</h3>
            <p className="font-body text-zinc-400 text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
              Everything looks clean. You haven't reported any order issues or logistics complaints.
            </p>
          </div>
        )}

      </div>

      {/* Large scale image preview modal overlay */}
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
              <img src={selectedImage} alt="Large Dispute Preview" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
