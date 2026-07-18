'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../../lib/apiClient';
import toast from 'react-hot-toast';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('orderId');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }
      try {
        await apiClient.post('/api/confirm-session', { sessionId, orderId });
        setSuccess(true);
        toast.success('Payment confirmed successfully!');
      } catch (err) {
        console.error('Error confirming session:', err);
        toast.error(err.message || 'Payment confirmation failed');
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, orderId]);

  return (
    <main className="w-full bg-white py-24 sm:py-32 min-h-[85vh] flex items-center justify-center">
      <div className="max-w-md w-full px-6 text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-dark border-t-[#C9FA75] rounded-full animate-spin" />
            <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">Confirming Payment</h1>
            <p className="font-body text-zinc-500 text-sm">Please do not refresh or close this window...</p>
          </div>
        ) : success ? (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-[#C9FA75]/25 text-dark rounded-full flex items-center justify-center mx-auto mb-4 scale-105 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <span className="text-[10px] font-heading font-bold tracking-[0.25em] text-[#C9FA75] bg-dark px-3.5 py-1.5 rounded-full uppercase">
              Order Confirmed
            </span>

            <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark uppercase tracking-tight leading-none mt-4">
              Thank You <br />For Your <span className="text-[#C9FA75]">Purchase</span>
            </h1>

            <p className="font-body text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
              Your payment has been successfully processed. We've received your order and are preparing your wardrobe essentials.
            </p>

            <div className="pt-8 space-y-3">
              <Link
                href="/products"
                className="w-full block bg-dark text-white hover:bg-[#C9FA75] hover:text-dark py-4 rounded-xl font-heading font-bold tracking-widest text-xs uppercase transition-colors duration-200"
              >
                Continue Shopping
              </Link>
              <Link
                href="/orders"
                className="w-full block border border-zinc-200 hover:border-dark text-dark py-4 rounded-xl font-heading font-bold tracking-widest text-xs uppercase transition-colors duration-200"
              >
                Track Your Orders
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="font-heading font-black text-3xl text-dark uppercase tracking-tight leading-none">
              Confirmation <span className="text-red-500">Failed</span>
            </h1>

            <p className="font-body text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
              We couldn't confirm your checkout session. If you have been charged, please contact customer support with your transaction details.
            </p>

            <div className="pt-8">
              <Link
                href="/products"
                className="w-full block bg-dark text-white hover:bg-[#C9FA75] hover:text-dark py-4 rounded-xl font-heading font-bold tracking-widest text-xs uppercase transition-colors duration-200"
              >
                Return to Shop
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="w-full bg-white py-24 min-h-[85vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-dark border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
